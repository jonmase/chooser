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
    /**
     * Save method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     */
    public function save()
    {
        $this->request->allowMethod(['patch', 'post', 'put']);
        $this->viewBuilder()->layout('ajax');
        
        if(!$this->request->data['choosing_instance_id']) {
            throw new InternalErrorException(__('Problem with saving selection - missing instance ID'));
        }
        
        //Get the instance, with the user's existing (unarchived) selection for this instance, if there is one
        $instance = $this->Selections->ChoosingInstances->getWithSelection($this->request->data['choosing_instance_id'], $this->Auth->user('id'));
        
        //Make sure the user is a viewer for this Choice
        $isViewer = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->isViewer($instance['choice_id'], $this->Auth->user('id'));
        if(!$isViewer) {
            throw new ForbiddenException(__('Not allowed to view this Choice.'));
        }
        
        $selection = $this->Selections->processForSave($instance, $this->request->data, $this->Auth->user('id'));
        //pr($selection);
        
        
        //exit;
        if ($this->Selections->save($selection, ['strategy' => 'replace'])) {
            $this->set('response', 'Selection saved');
            
            $optionsSelected = $this->Selections->OptionsSelections->find('list', [
                'conditions' => ['selection_id' => $selection->id],
                'valueField' => 'choices_option_id'
            ]);
            $optionsSelected = array_values($optionsSelected->toArray());
            //pr($optionsSelected);
            
            list($allowSubmit, $ruleWarnings) = $this->Selections->ChoosingInstances->Rules->checkSelection($optionsSelected, $instance['id'], $instance['choice_id']);
            //pr($allowSubmit);
            //pr($ruleOutcomes);
            
            $this->set(compact('optionsSelected', 'allowSubmit', 'ruleWarnings'));
        } 
        else {
            throw new InternalErrorException(__('Problem with saving selection'));
        }
    }
}
