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
    public function getOptions($choiceId = null, $action = 'view', $orderField = 'code', $orderDirection = 'ASC')
    {
        //If action is edit, make sure the user is an editor for this Choice
        if($action === 'edit') {
            $isEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $this->Auth->user('id'));
            if(!$isEditor) {
                throw new ForbiddenException(__('Not an editor for this Choice.'));
            }
            
            //Get the options for which this user is an editor
            $options = $this->Options->getForView($choiceId, false, false, $orderField, $orderDirection, true, $this->Auth->user('id'));
        }
        
        //If action is approve, make sure the user is an approver for this Choice
        /*else if($action === 'approve') {
            $isApprover = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isApprover($choiceId, $this->Auth->user('id'));
            if(!$isApprover) {
                throw new ForbiddenException(__('Not an approver for this Choice.'));
            }
            
            //Get the options for which this user is an approver
            $options = $this->Options->getForView($choiceId, true, false, $orderField, $orderDirection);
        }*/
        
        else {
            $isViewer = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isViewer($choiceId, $this->Auth->user('id'));
            if(!$isViewer) {
                throw new ForbiddenException(__('Not allowed to view this Choice.'));
            }

            //Get all of the published and approved options
            $options = $this->Options->getForView($choiceId, true, true, $orderField, $orderDirection);
        }
        
        //Create an array of optionIds mapped to index in options array
        //TODO: This feels quite ugly/hard work, but is intended to save time repeatedly looping through the array of options to find the one with the right ID
        $optionIndexesById = [];
        foreach($options as $key => $option) {
            $optionIndexesById[$option['id']] = $key;
        }

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
    public function index($choiceId = null, $action = 'view')
    {
        //If action is edit, make sure the user is an editor for this Choice
        if($action === 'edit') {
            $isEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $this->Auth->user('id'));
            if(!$isEditor) {
                throw new ForbiddenException(__('Not an editor for this Choice.'));
            }
        }
        
        //If action is approve, make sure the user is an approver for this Choice
        else if($action === 'approve') {
            $isApprover = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isApprover($choiceId, $this->Auth->user('id'));
            if(!$isApprover) {
                throw new ForbiddenException(__('Not an approver for this Choice.'));
            }
        }
        else {
            $isViewer = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isViewer($choiceId, $this->Auth->user('id'));
            if(!$isViewer) {
                throw new ForbiddenException(__('Not a viewer for this Choice.'));
            }
            $action = 'confirm';
        }
        
        //Does the user have additional roles? I.e., should the dashboard menu be shown?
        $hasAdditionalRoles = $this->Options->ChoicesOptions->Choices->ChoicesUsers->hasAdditionalRoles($choiceId, $this->Auth->user('id'));
        if($hasAdditionalRoles) {
            //Get the sections to display in the Dashboard menu
            $sections = $this->Options->ChoicesOptions->Choices->getDashboardSectionsFromId($choiceId, $this->Auth->user('id'));
            $this->set(compact('sections'));
        }
        
        $choice = $this->Options->ChoicesOptions->Choices->getChoiceWithProcessedExtraFields($choiceId);
        //pr($choice);

        $this->set(compact('action', 'choice'));
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
    public function save($choiceId = null) {
        $this->request->allowMethod(['patch', 'post', 'put']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an editor for this Choice
        $userId = $this->Auth->user('id');
        $isChoiceEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $userId);
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
            $choicesOptionsQuery->matching('ChoicesOptionsUsers', function ($q) use ($userId) {
                return $q->where([
                    'ChoicesOptionsUsers.user_id' => $userId,
                    'ChoicesOptionsUsers.editor' => true,
                ]);
            });
            
            unset($this->request->data['choices_option_id']);
            
            $originalChoicesOption = $choicesOptionsQuery->first();
            if(empty($originalChoicesOption)) {
                throw new ForbiddenException(__('Not permitted to edit this option.'));
            }
            unset($originalChoicesOption->_matchingData);
            //pr($originalChoicesOption);
        }
        $updatedChoicesOption = $this->Options->processForSave($choiceId, $userId, $this->request->data, $originalChoicesOption);
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
            
            $option = $this->Options->processForView($updatedChoicesOption, null, $choiceId);
            //pr($option);
            //exit;
            $this->set('option', $option);
        } 
        else {
            throw new InternalErrorException(__('Problem with saving option'));
        }
    }
}
