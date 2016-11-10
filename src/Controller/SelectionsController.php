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
}
