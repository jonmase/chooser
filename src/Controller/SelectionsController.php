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
        
        //Make sure the user is a viewer for this Choice
        $instance = $this->Selections->ChoosingInstances->get($this->request->data['choosing_instance_id'], [
            'contain' => [
                'Selections' => function ($q) {
                   return $q
                        ->select(['id', 'choosing_instance_id', 'user_id', 'confirmed', 'archived'])
                        ->where([
                            'Selections.user_id' => $this->Auth->user('id'),
                            'Selections.confirmed' => filter_var($this->request->data['confirmed'], FILTER_VALIDATE_BOOLEAN),
                            'Selections.archived' => false
                        ]);
                }
            ]
        ]);
        
        $isViewer = $this->Selections->ChoosingInstances->Choices->ChoicesUsers->isViewer($instance['choice_id'], $this->Auth->user('id'));
        if(!$isViewer) {
            throw new ForbiddenException(__('Not allowed to view this Choice.'));
        }
        
        //If there is already an unconfirmed selection for this user/instance, use this as the basic data
        if(!empty($instance['selections'])) {
            $selection = $instance['selections'][0];
        }
        //Otherwise, use the request data
        else {
            $selectionData = $this->request->data;
            unset($selectionData['options_selected']);   //Remove options_selected from the data to save
            
            $selectionData['user_id'] = $this->Auth->user('id'); //Add user_id to data
            
            $selection = $this->Selections->newEntity($selectionData);
        }
        
        $optionsSelectionsData = [];
        if(!empty($this->request->data['options_selected'])) {
            foreach($this->request->data['options_selected'] as $choicesOptionId) {
                $optionsSelection = [
                    'choices_option_id' => $choicesOptionId,
                ];
                
                //If we have a selection ID, add this to the optionsSelection data
                if(!empty($selectionData['id'])) {
                    $optionsSelection['selection_id'] = $selectionData['id'];
                }
                
                $optionsSelectionsData[] = $optionsSelection;
            }
        }
        
        $selection['options_selections'] = $this->Selections->OptionsSelections->newEntities($optionsSelectionsData);
        
        //pr($selection);
        //exit;
        if ($this->Selections->save($selection, ['strategy' => 'replace'])) {
            $this->set('response', 'Selection saved');
        } 
        else {
            throw new InternalErrorException(__('Problem with saving selection'));
        }
    }
}
