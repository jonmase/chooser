<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;

/**
 * Options Controller
 *
 * @property \App\Model\Table\OptionsTable $Options
 */
class OptionsController extends AppController
{
    /**
     * getOptions method
     *
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user does not have correct permissions for the action
     */
    public function getOptions($action = 'view')
    {
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        //If action is edit, make sure the user is an editor for this Choice
        if($action === 'edit') {
            $isEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $currentUserId, $tool);
            if(!$isEditor) {
                throw new ForbiddenException(__('Not an editor for this Choice.'));
            }
            
            //Get the options for which this user is an editor
            $options = $this->Options->getForView($choiceId, false, false, true, $currentUserId);
        }
        
        //If action is approve, make sure the user is an approver for this Choice
        /*else if($action === 'approve') {
            $isApprover = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isApprover($choiceId, $currentUserId, $tool);
            if(!$isApprover) {
                throw new ForbiddenException(__('Not an approver for this Choice.'));
            }
            
            //Get the options for which this user is an approver
            $options = $this->Options->getForView($choiceId, true, false);
        }*/
        
        else {
            $isViewer = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isViewer($choiceId, $currentUserId, $tool);
            if(!$isViewer) {
                throw new ForbiddenException(__('Not allowed to view this Choice.'));
            }

            //Get all of the published and approved options
            $options = $this->Options->getForView($choiceId, true, true);
        }
        
        $optionIndexesById = $this->Options->getOptionIndexesById($options);

        $this->set(compact('options', 'optionIndexesById'));
        $this->set('_serialize', ['options', 'optionIndexesById']);
    }
    

    /**
     * Index method
     *
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not Editor
     * @throws \Cake\Datasource\Exception\RecordNotFoundException If Choice is not found.
     */
    public function index($action = 'view')
    {
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        //Does the user have additional roles? I.e., should the dashboard menu be shown?
        $isMoreThanViewer = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isMoreThanViewer($choiceId, $currentUserId, $tool);
        if($isMoreThanViewer) {
            //Get the sections to display in the Dashboard menu
            $sections = $this->Options->ChoicesOptions->Choices->getDashboardSectionsForUser($choiceId, $currentUserId, $tool);
            $this->set(compact('sections'));
            
            $isAdmin = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
            if($isAdmin) {
                $role = 'admin';
            }
            else {
                $role = 'extra';    //User has some sort of extra permissions
            }
        }
        else {
            $role = 'view';
        }
        
        //If action is edit, make sure the user is an editor for this Choice
        if($action === 'edit') {
            $isEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $currentUserId, $tool);
            if(!$isEditor) {
                throw new ForbiddenException(__('Not an editor for this Choice.'));
            }
            
            if(!$isAdmin) {
                //If not admin, check whether there is an editing instance and editing has opened. If not, redirect to dashboard
                $editingInstance = $this->Options->ChoicesOptions->Choices->EditingInstances->getActive($choiceId);
                if(empty($editingInstance) || !$editingInstance['opens']['passed']) {
                    $this->redirect(['controller' => 'choices', 'action' => 'dashboard']);
                }
            }
        }
        
        //If action is approve, make sure the user is an approver for this Choice
        else if($action === 'approve') {
            $isApprover = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isApprover($choiceId, $currentUserId, $tool);
            if(!$isApprover) {
                throw new ForbiddenException(__('Not an approver for this Choice.'));
            }
        }
        //Otherwise view action, but need to work out whether it should be initial view or review
        else {
            $isViewer = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isViewer($choiceId, $currentUserId, $tool);
            if(!$isViewer) {
                throw new ForbiddenException(__('Not a viewer for this Choice.'));
            }
            
            $choosingInstanceQuery = $this->Options->ChoicesOptions->Choices->ChoosingInstances->find('all', [
                'conditions' => ['choice_id' => $choiceId, 'active' => true],
                'contain' => [
                    'Selections' => function ($q) use ($currentUserId) {
                        return $q
                            ->select(['id', 'choosing_instance_id', 'confirmed', 'modified'])
                            ->where(['Selections.user_id' => $currentUserId, 'archived' => false])
                            ->order(['Selections.confirmed' => 'DESC', 'Selections.modified' => 'DESC']);
                        }
                ],
            ]);
            
            //If there is no instance set up, and user does not have any additional roles, they should not be allowed to view the options
            if($choosingInstanceQuery->isEmpty()) {
                if(!$isMoreThanViewer) {
                    $action = 'unavailable';
                }
                else {
                    //If not admin, check whether there is an editing instance and editing has opened. If not, redirect to dashboard
                    if(!$isAdmin) {
                        $editingInstance = $this->Options->ChoicesOptions->Choices->EditingInstances->getActive($choiceId);
                        if(empty($editingInstance) || !$editingInstance['opens']['passed']) {
                            $this->redirect(['controller' => 'choices', 'action' => 'dashboard']);
                        }
                    }
                }
            }
            else {
                //$instance = $choosingInstanceQuery->first()->toArray();
                $instance = $this->Options->ChoicesOptions->Choices->ChoosingInstances->processForView($choosingInstanceQuery->first());

                //If the user has confirmed a selection, show the confirmed page
                //Or if the deadline and extension have both passed, show the confirmed page
                if((!empty($instance['selections']) && $instance['selections'][0]['confirmed']) || ($instance['deadline']['passed'] && $instance['extension']['passed'])) {
                    $action = 'confirmed';
                }
                else {
                    $action = 'view';
                }
            }
        }
        
        $choice = $this->Options->ChoicesOptions->Choices->getChoiceWithProcessedExtraFields($choiceId);
        //pr($choice);

        $this->set(compact('action', 'choice', 'role'));
    }

    /**
     * save method
     *
     * @param string|null $id Profile id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Editor, or cannot edit this option
	 * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     */
    public function save() {
        $this->request->allowMethod(['patch', 'post', 'put']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an editor for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isChoiceEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $currentUserId, $tool);
        if(empty($isChoiceEditor)) {
            throw new ForbiddenException(__('Not permitted to create/edit options for this Choice.'));
        }

        //pr($this->request->data);
        $originalChoicesOption = null;
        if(!empty($this->request->data['choices_option_id'])) {
            $choicesOptionsQuery = $this->Options->ChoicesOptions->find('all', [
                'conditions' => [
                    'ChoicesOptions.id' => $this->request->data['choices_option_id'],
                ],
                'contain' => [
                    'Options',
                ]
            ]);
            unset($this->request->data['choices_option_id']);
            
            //If user is not an admin, they must be an editor on the choicesOption
            $isChoiceAdmin = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
            if(!$isChoiceAdmin) {
                $choicesOptionsQuery->matching('ChoicesOptionsUsers', function ($q) use ($currentUserId) {
                    return $q->where([
                        'ChoicesOptionsUsers.user_id' => $currentUserId,
                        'ChoicesOptionsUsers.editor' => true,
                    ]);
                });
                
                unset($originalChoicesOption->_matchingData);
                //pr($originalChoicesOption);
            }
            
            $originalChoicesOption = $choicesOptionsQuery->first();
            if(empty($originalChoicesOption)) {
                throw new ForbiddenException(__('Not permitted to edit this option.'));
            }
        }
        $updatedChoicesOption = $this->Options->processForSave($choiceId, $currentUserId, $this->request->data, $originalChoicesOption);
        $choicesOptions = [$updatedChoicesOption];
        
        if($originalChoicesOption) {
            $originalChoicesOption = $originalChoicesOption->toArray();
            $originalChoicesOption['revision_parent'] = $originalChoicesOption['id'];
            $originalChoicesOption['option']['revision_parent'] = $originalChoicesOption['option']['id'];
            unset($originalChoicesOption['id'], $originalChoicesOption['option']['id']);
            $choicesOptions[] = $this->Options->ChoicesOptions->newEntity($originalChoicesOption);
        }

        //pr($choicesOptions);
        //exit;
   
        if($this->Options->ChoicesOptions->saveMany($choicesOptions)) {
            $this->set('response', 'Option saved');
            
            $options = $this->Options->getForView($choiceId, false, false, true, $currentUserId);
            $optionIndexesById = $this->Options->getOptionIndexesById($options);

            $this->set(compact('options', 'optionIndexesById'));
        } 
        else {
            throw new InternalErrorException(__('Problem with saving option'));
        }
    }
}
