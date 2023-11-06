<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;

/**
 * Selections Controller
 *
 * @property \App\Model\Table\SelectionsTable $Selections
 */
class SelectionsController extends AppController
{
    /*public function get($instanceId) {
        if(!$instanceId) {
            return [];
        }
        
        $selection = $this->Selections->findByInstanceAndUser($instanceId, $this->Auth->user('id'));

        $selected = [];
        if(!empty($selection)) {
            foreach($selection['options_selections'] as $option) {
                $selected[] = $option['choices_option_id'];
            }
            //unset($selection['options_selections']);
        }
        list($allowSubmit, $ruleWarnings) = $this->Selections->ChoosingInstances->Rules->checkSelection($selected, $instanceId, $choiceId);

        unset($choosingInstance->selections);
        
        $this->set(compact('choosingInstance', 'favourites', 'selection', 'selected', 'allowSubmit', 'ruleWarnings'));
        $this->set('_serialize', ['choosingInstance', 'favourites', 'selection', 'selected', 'allowSubmit', 'ruleWarnings']);
    }*/
    
    /**
     * Abandon method
     * For abandoning changes to a selection
     * requires selection id and instance id to be passed in the request data
     */
    public function abandon()
    {
        $this->request->allowMethod(['patch', 'post', 'put']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is a viewer for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isViewer = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->isViewer($choiceId, $currentUserId, $tool);
        if(!$isViewer) {
            throw new ForbiddenException(__('Not allowed to view this Choice.'));
        }
        
        if(empty($this->request->data['selection_id']) || empty($this->request->data['instance_id'])) {
            throw new InternalErrorException(__('Error abandoning selection - missing instance or selection ID'));
        }
        
        //Get the selection
        $selection = $this->Selections->get($this->request->data['selection_id']);
        
        //Make sure that this user is the owner of this selection
        if($selection->user_id !== $currentUserId)   {
            throw new InternalErrorException(__('Error abandoning selection - user is not selection owner'));
        }
        //Make sure that this selection is not already archived
        if($selection->archived) {
            throw new InternalErrorException(__('Error abandoning selection - selection already archived'));
        }
        
        $selection->archived = true;

        if ($this->Selections->save($selection)) {
            $this->set('response', 'Selection changes abandoned');
            
            //Get what is now the current selection for this user
            $instance = $this->Selections->ChoosingInstances->get($this->request->data['instance_id']); //Get the instance
            $selections = $this->Selections->findByInstanceAndUser($instance['id'], $this->Auth->user('id'));   //Get all of the unarchived selections for this user
            
            if(!empty($selections)) {
                $selection = array_shift($selections);
                
                //Archive the remaining selections (this should never be necessary, as there should only ever be one unarchived selection)
                if(!empty($selections)) {
                    $this->Selections->archive($selections);
                }
            }
            else {
                $selection = [];
            }
            
            list($optionsSelected, $optionsSelectedIds, $optionsSelectedIdsPreferenceOrder) = $this->Selections->processSelectedOptions($selection);
            list($allowSubmit, $ruleWarnings) = $this->Selections->ChoosingInstances->Rules->checkSelection($optionsSelectedIds, $instance['id'], $instance['choice_id']);

            $this->set(compact('selection', 'optionsSelected', 'optionsSelectedIds', 'optionsSelectedIdsPreferenceOrder', 'allowSubmit', 'ruleWarnings'));
        } 
        else {
            throw new InternalErrorException(__('Problem with abandoning selection'));
        }
    }
    
    /**
     * Save method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     */
    public function save()
    {
        $this->request->allowMethod(['patch', 'post', 'put']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is a viewer for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isViewer = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->isViewer($choiceId, $currentUserId, $tool);
        if(!$isViewer) {
            throw new ForbiddenException(__('Not allowed to view this Choice.'));
        }
        
        //Make sure there is an instance ID
        if(empty($this->request->data['selection']['choosing_instance_id'])) {
            throw new InternalErrorException(__('Problem with saving selection - missing instance ID'));
        }
        
        //Get the instance, with the user's existing (unarchived) selection for this instance, if there is one
        //$instance = $this->Selections->ChoosingInstances->getWithSelection($this->request->data['choosing_instance_id'], $this->request->data['selection']['id'], $this->Auth->user('id'));
        $instance = $this->Selections->ChoosingInstances->get($this->request->data['selection']['choosing_instance_id']);
        
        $selection = $this->Selections->processForSave($this->request->data, $this->Auth->user('id'));
        //pr($selection);
        //exit;
        if ($this->Selections->save($selection, ['strategy' => 'replace'])) {
            $this->set('response', 'Selection saved');
            
            list($optionsSelected, $optionsSelectedIds, $optionsSelectedIdsPreferenceOrder) = $this->Selections->processSelectedOptions($selection);
            
            $selection['modified'] = $this->Selections->formatDate($selection['modified']);
            
            list($allowSubmit, $ruleWarnings) = $this->Selections->ChoosingInstances->Rules->checkSelection($optionsSelectedIds, $instance['id'], $instance['choice_id']);
            
            $this->set(compact('selection', 'optionsSelected', 'optionsSelectedIds', 'optionsSelectedIdsPreferenceOrder', 'allowSubmit', 'ruleWarnings'));
        } 
        else {
            throw new InternalErrorException(__('Problem with saving selection'));
        }
    }
    
    public function index() {
        //Make sure the user is allowed to view the results for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $canViewResults = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->canViewResults($choiceId, $currentUserId, $tool);
        if(!$canViewResults) {
            throw new ForbiddenException(__('Not permitted to view Choice results.'));
        }

        //Get the sections to display in the Dashboard menu
        $sections = $this->Selections->ChoosingInstances->Choices->getDashboardSectionsForUser($choiceId, $currentUserId, $tool);

        $choice = $this->Selections->ChoosingInstances->Choices->getChoiceWithProcessedExtraFields($choiceId, 'view');

        $this->set(compact('choice', 'sections'));
    }
    
    public function getConfirmed() {
        //Make sure the user is allowed to view the results for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isViewer = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->isViewer($choiceId, $currentUserId, $tool);
        if(!$isViewer) {
            throw new ForbiddenException(__('Not permitted to view this Choice.'));
        }

        $choosingInstance = $this->Selections->ChoosingInstances->getActive($choiceId);
        
        $confirmedSelections = $this->Selections->findByInstanceAndUser($choosingInstance['id'], $currentUserId, true, true);
        
        /*$submittedTimestamps = [];
        foreach($submittedSelections as $selection) {
            $submittedTimestamps[$selection['id']] = $selection['modified']['timestamp'];
        }*/
        //pr($submittedTimestamps);
        
        $this->set(compact('confirmedSelections'));
        $this->set('_serialize', ['confirmedSelections']);
    }

    
    public function getResults() {
        //Make sure the user is allowed to view the results for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $canViewResults = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->canViewResults($choiceId, $currentUserId, $tool);
        if(!$canViewResults) {
            throw new ForbiddenException(__('Not permitted to view Choice results.'));
        }
        
        //Get the choosing instance
        $choosingInstance = $this->Selections->ChoosingInstances->findByChoiceId($choiceId, true)->first()->toArray();
        
        //Get the selections
        list($options, $optionIndexesById, $selections, $selectionIndexesById, $statistics) = $this->Selections->getForResults($choosingInstance);
        
        //pr($optionsSelectedCounts);
        //pr($selections);
        //pr($options);
        
        $this->set(compact('choosingInstance', 'options', 'optionIndexesById', 'selections', 'selectionIndexesById'));
        $this->set('_serialize', ['choosingInstance', 'options', 'optionIndexesById', 'selections', 'selectionIndexesById']);
    }
    
    public function download($type = 'student') {
        //Make sure the user is allowed to view the results for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $canViewResults = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->canViewResults($choiceId, $currentUserId, $tool);
        if(!$canViewResults) {
            throw new ForbiddenException(__('Not permitted to view Choice results.'));
        }
        
        //Make sure type is either student or option
        if($type !== 'student' && $type !== 'option') {
            $type = 'student';
        }
        
        //Get the choice
        $choice = $this->Selections->ChoosingInstances->Choices->get($choiceId);
        
        //Get the choosing instance
        $choosingInstance = $this->Selections->ChoosingInstances->findByChoiceId($choiceId, true)->first()->toArray();
        
        //Get the selections
        list($options, $optionIndexesById, $selections, $selectionIndexesById, $statistics) = $this->Selections->getForResults($choosingInstance);
        //pr($statistics);
        //pr($selections);
        
        $filename = str_replace(' ', '_', $choice['name'])  . "_Responses" . "_By" . ucfirst($type) . ".xls";
        
        $this->set(compact('choice', 'choosingInstance', 'options', 'selections', 'statistics', 'filename'));
        
        $this->viewBuilder()->layout('excel');
        $this->render('download_' . $type);
    }
}
