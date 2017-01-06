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
     * Archive method
     *
     */
    public function archive()
    {
        $this->request->allowMethod(['patch', 'post', 'put']);
        $this->viewBuilder()->layout('ajax');
        
        if(empty($this->request->data['selection_id']) || empty($this->request->data['instance_id'])) {
            throw new InternalErrorException(__('Error archiving selection - missing instance or selection ID'));
        }
        
        //Get the selection
        $selection = $this->Selections->get($this->request->data['selection_id']);
        
        //Make sure that this user is the owner of this selection
        if($selection->user_id !== $this->Auth->user('id'))   {
            throw new InternalErrorException(__('Error archiving selection - user is not selection owner'));
        }
        
        //Get the instance
        $instance = $this->Selections->ChoosingInstances->get($this->request->data['instance_id']);
        
        //Make sure the user is a viewer for this Choice
        $isViewer = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->isViewer($instance['choice_id'], $this->Auth->user('id'));
        if(!$isViewer) {
            throw new ForbiddenException(__('Not allowed to view this Choice.'));
        }
        
        if($selection->archived) {
            throw new InternalErrorException(__('Error archiving selection - selection already archived'));
        }
        
        $selection->archived = true;
        //pr($selection);
        //exit;
        if ($this->Selections->save($selection)) {
            $this->set('response', 'Selection changes abandoned');
            
            $selections = $this->Selections->findByInstanceAndUser($instance['id'], $this->Auth->user('id'));
            
            if(!empty($selections)) {
                $selection = array_shift($selections);
                
                //Archive the remaining selections (should only ever be one)
                $this->Selections->archive($selections);
            }
            else {
                $selection = [];
            }
            
            list($optionsSelected, $optionsSelectedIds, $optionsSelectedIdsPreferenceOrder) = $this->Selections->processSelectedOptions($selection);
            list($allowSubmit, $ruleWarnings) = $this->Selections->ChoosingInstances->Rules->checkSelection($optionsSelectedIds, $instance['id'], $instance['choice_id']);

            $this->set(compact('selection', 'optionsSelected', 'optionsSelectedIds', 'optionsSelectedIdsPreferenceOrder', 'allowSubmit', 'ruleWarnings'));
        } 
        else {
            throw new InternalErrorException(__('Problem with saving selection'));
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
        
        if(empty($this->request->data['selection']['choosing_instance_id'])) {
            throw new InternalErrorException(__('Problem with saving selection - missing instance ID'));
        }
        
        //Get the instance, with the user's existing (unarchived) selection for this instance, if there is one
        //$instance = $this->Selections->ChoosingInstances->getWithSelection($this->request->data['choosing_instance_id'], $this->request->data['selection']['id'], $this->Auth->user('id'));
        $instance = $this->Selections->ChoosingInstances->get($this->request->data['selection']['choosing_instance_id']);
        
        //Make sure the user is a viewer for this Choice
        $isViewer = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->isViewer($instance['choice_id'], $this->Auth->user('id'));
        if(!$isViewer) {
            throw new ForbiddenException(__('Not allowed to view this Choice.'));
        }
        
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
    
    public function index($choiceId) {
        //Make sure the user is allowed to view the results for this Choice
        $canViewResults = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->canViewResults($choiceId, $this->Auth->user('id'));
        if(!$canViewResults) {
            throw new ForbiddenException(__('Not permitted to view Choice results.'));
        }

        //Get the sections to display in the Dashboard menu
        $sections = $this->Selections->ChoosingInstances->Choices->getDashboardSectionsFromId($choiceId, $this->Auth->user('id'));

        $choice = $this->Selections->ChoosingInstances->Choices->getChoiceWithProcessedExtraFields($choiceId);

        $this->set(compact('choice', 'sections'));
    }
    
    public function getSelections($choiceId) {
        //Make sure the user is allowed to view the results for this Choice
        $canViewResults = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->canViewResults($choiceId, $this->Auth->user('id'));
        if(!$canViewResults) {
            throw new ForbiddenException(__('Not permitted to view Choice results.'));
        }
        
        //Get the choosing instance
        $choosingInstance = $this->Selections->ChoosingInstances->findActive($choiceId, false, $this->Auth->user('id'));
        
        $optionsSelectionsSort = [];
        if($choosingInstance['preference']) {
            if($choosingInstance['preference_type'] === 'rank') {
                $optionsSelectionsSort = ['OptionsSelections.rank' => 'ASC'];
            }
            else if($choosingInstance['preference_type'] === 'points') {
                $optionsSelectionsSort = ['OptionsSelections.points' => 'DESC'];
            }
        }
        
        $selectionsQuery = $this->Selections->find('all', [
            'conditions' => [
                'choosing_instance_id' => $choosingInstance->id,
                'archived' => 0,
            ],
            //'contain' => ['OptionsSelections.ChoicesOptions.Options', 'Users']
            'contain' => ['OptionsSelections' => ['sort' => $optionsSelectionsSort], 'Users'],
            'order' => ['Selections.modified' => 'DESC']
        ]);
        $selections = $selectionsQuery->toArray();
        
        $options = $this->Selections->OptionsSelections->ChoicesOptions->Options->getForView($choiceId, true, true);
        //$optionIndexesById = $this->Selections->OptionsSelections->ChoicesOptions->Options->getOptionIndexesById($options);
        
        $optionsSelectedCounts = [];
        $optionsSelectedBy = [];
        
        $selectionIndexesById = [];
        foreach($selections as $key => &$selection) {
            $selectionIndexesById[$selection['id']] = $key;
            
            $selection['modified'] = $this->Selections->formatDatetimeObjectForView($selection['modified']);
            $selection['option_count'] = count($selection['options_selections']);
            
            $optionsSelectedIdsOrdered = [];
            $optionsSelectedById = [];
            
            foreach($selection['options_selections'] as $optionSelected) {
                //Convert the selected options to the correct format for the option-list component
                $optionsSelectedIdsOrdered[] = $optionSelected['choices_option_id'];
                $optionsSelectedById[$optionSelected['choices_option_id']] = $optionSelected;
                
                //If the selection is confirmed, increment the counts for the chosen options, and record that the option is selected by this user
                if($selection['confirmed']) {
                    //If option ID does not already have a count
                    if(!isset($optionsSelectedCounts[$optionSelected['choices_option_id']])) {
                        $optionsSelectedCounts[$optionSelected['choices_option_id']] = 1;
                    }
                    else {
                        $optionsSelectedCounts[$optionSelected['choices_option_id']]++;
                    }
                    
                    if(!isset($optionsSelectedBy[$optionSelected['choices_option_id']])) {
                        $optionsSelectedBy[$optionSelected['choices_option_id']] = [];
                    }
                    $optionsSelectedBy[$optionSelected['choices_option_id']][] = $selection['id'];
                }
            }
            
            $selection['options_selected_ids_ordered'] = $optionsSelectedIdsOrdered;
            $selection['options_selected_by_id'] = $optionsSelectedById;
            unset($selection['options_selections']);
        }
        
        $optionIndexesById = [];
        foreach($options as $key => &$option) {
            $optionIndexesById[$option['id']] = $key;
            
            //If option ID is set in optionsSelectedCounts, use the count from that, and add selected_by to the array
            if(isset($optionsSelectedCounts[$option['id']])) {
                $option['count'] = $optionsSelectedCounts[$option['id']];
                $option['selected_by'] = $optionsSelectedBy[$option['id']];
            }
            //Otherwise, option hasn't been chosen, so set count to 0 and selected_by as empty array
            else {
                $option['count'] = 0;
                $option['selected_by'] = [];
            }
        }
        //pr($optionsSelectedCounts);
        //pr($selections);
        //pr($options);
        
        $this->set(compact('choosingInstance', 'options', 'optionIndexesById', 'selections', 'selectionIndexesById'));
        $this->set('_serialize', ['choosingInstance', 'options', 'optionIndexesById', 'selections', 'selectionIndexesById']);
    }
}
