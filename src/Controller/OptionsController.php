<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;
use Cake\I18n\Time;

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
    public function getOptions($action = 'view', $role = null)
    {
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        //If action is edit...
        if($action === 'edit') {
            $isAdmin = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
            $isApprover = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isApprover($choiceId, $currentUserId, $tool);
            $isEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $currentUserId, $tool);
            
            if(!$isAdmin && !$isApprover && !$isEditor) {
                throw new ForbiddenException(__('Not an editor/approver for this Choice.'));
            }
            
            $options = $this->Options->getOptionsForEdit($choiceId, $currentUserId, $isAdmin, $isApprover, $isEditor);
        }
        else {
            $isViewer = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isViewer($choiceId, $currentUserId, $tool);
            if(!$isViewer) {
                throw new ForbiddenException(__('Not allowed to view this Choice.'));
            }

            //Get all of the viewable options
            $options = $this->Options->getOptionsForView($choiceId);
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
        $roles = $this->Options->ChoicesOptions->Choices->ChoicesUsers->getUserRoles($choiceId, $currentUserId, $tool);
        
        $isMoreThanViewer = !empty($roles);
        if($isMoreThanViewer) {
            //Get the sections to display in the Dashboard menu
            $sections = $this->Options->ChoicesOptions->Choices->getDashboardSectionsForUser($choiceId, $currentUserId, $tool);
            $this->set(compact('sections'));
            
            $isEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $currentUserId, $tool);
            $isApprover = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isApprover($choiceId, $currentUserId, $tool);
            $isAdmin = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        }

        //If action is edit, make sure the user is an editor for this Choice
        if($action === 'edit') {
            if(!$isAdmin && !$isApprover && !$isEditor) {
                throw new ForbiddenException(__('Not allowed to view the edit/approve options page for this Choice.'));
            }
            
            if(!$isAdmin) {
                //If not admin, check whether there is an editing instance and editing has opened. If not, redirect to dashboard
                $editingInstance = $this->Options->ChoicesOptions->Choices->EditingInstances->getActive($choiceId);
                if(empty($editingInstance) || !$editingInstance['opens']['passed']) {
                    $this->redirect(['controller' => 'choices', 'action' => 'dashboard']);
                }
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

        $this->set(compact('action', 'choice', 'roles'));
    }
    
    /**
     * status method
     * Change the status (publish, approve or delete) an option
     *
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Editor, or cannot edit this option
	 * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     */
    public function status() {
        $this->request->allowMethod(['patch', 'post', 'put']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an editor for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $currentUserId, $tool);
        $isApprover = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isApprover($choiceId, $currentUserId, $tool);
        $isAdmin = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(!$isAdmin && !$isApprover && !$isEditor) {
            throw new ForbiddenException(__('Not allowed to change option statuses for this Choice.'));
        }
        
        //Make sure an option has been specified
        if(!empty($this->request->data['action']) && !empty($this->request->data['choices_option_id']) && isset($this->request->data['status'])) {
            $action = $this->request->data['action'];
            
            $status = filter_var($this->request->data['status'], FILTER_VALIDATE_BOOLEAN);
            
            $choicesOption = $this->Options->ChoicesOptions->get($this->request->data['choices_option_id']);    //Get the choices option
            //pr($choicesOption);
            
            //Create copy of the option to save as the revision, removing ID, setting revision_parent and making it new
            $originalChoicesOption = clone $choicesOption;
            $originalChoicesOption->revision_parent = $choicesOption->id;
            unset($originalChoicesOption->id);
            $originalChoicesOption->isNew(true);
            
            //Work out the DB field stem from the action
            if($action === 'publish') {
                $dbFieldStem = 'publishe';
            }
            else {
                $dbFieldStem = $action;
            }
            
            $statusField = $dbFieldStem . 'd';
            $userField = $dbFieldStem . 'r';
            $dateField = $statusField . '_date';
            
            //If changing status to true, update the choicesOption record with user and date
            if($status) {
                if($choicesOption[$statusField]) {
                    throw new InternalErrorException(__('Option is already ' . $statusField));
                }
                $choicesOption[$statusField] = true;
                $choicesOption[$userField] = $this->Auth->user('id');
                $choicesOption[$dateField] = Time::now();
            }
            //If changing status to false, clear user and date
            else {
                $choicesOption[$statusField] = false;
                $choicesOption[$userField] = null;
                $choicesOption[$dateField] = null;
            }

            $choicesOptionsToSave = [
                $originalChoicesOption,
                $choicesOption,
            ];

            //pr($choicesOptionsToSave); exit;
            if($this->Options->ChoicesOptions->saveMany($choicesOptionsToSave)) {
                if($action === 'delete' && !$status) {
                    $actionVerb = 'restored';
                }
                else {
                    $actionVerb = ($status?'':'un') . $statusField;
                }
                
                $this->set('response', 'Option ' . $actionVerb);
                
                $options = $this->Options->getOptionsForEdit($choiceId, $currentUserId, $isAdmin, $isApprover, $isEditor);
                $optionIndexesById = $this->Options->getOptionIndexesById($options);

                $this->set(compact('options', 'optionIndexesById'));
            }
        }
        else {
            throw new InternalErrorException(__('Missing action, option ID or status'));
        }
    }

    /**
     * save method
     *
     * @return \Cake\Network\Response|null
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
        
        $isAdmin = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        $isEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $currentUserId, $tool);
        if(empty($isEditor)) {
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
            if(!$isAdmin) {
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
            
            $options = $this->Options->getOptionsForEdit($choiceId, $currentUserId, $isAdmin, false, $isEditor);
            $optionIndexesById = $this->Options->getOptionIndexesById($options);

            $this->set(compact('options', 'optionIndexesById'));
        } 
        else {
            throw new InternalErrorException(__('Problem with saving option'));
        }
    }
}
