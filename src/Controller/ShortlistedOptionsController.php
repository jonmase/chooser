<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;

/**
 * ShortlistedOptions Controller
 *
 * @property \App\Model\Table\ShortlistedOptionsTable $ShortlistedOptions
 */
class ShortlistedOptionsController extends AppController
{
    /**
     * Favourite method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not a Viewer
	 * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When instance record not found.
     */
    public function favourite($action = 'add', $instanceId = null, $choicesOptionId = null)
    {
        $this->request->allowMethod(['post']);
        if(!$instanceId || !$choicesOptionId) {
            throw new InternalErrorException(__('Problem with saving favourite - missing data'));
        }
        
        $instance = $this->ShortlistedOptions->ChoosingInstances->get($instanceId);
        
        //Make sure this user is allowed to view this choice
        $isViewer = $this->ShortlistedOptions->ChoicesOptions->Choices->ChoicesUsers->isViewer($instance['choice_id'], $this->Auth->user('id'), $this->request->session()->read('tool'));
        if(empty($isViewer)) {
            throw new ForbiddenException(__('Not permitted to add favourites for this Choice.'));
        }
        
        $data = [
            'user_id' => $this->Auth->user('id'),
            'choosing_instance_id' => $instanceId,
            'choices_option_id' => $choicesOptionId,
        ];
        
        //Check whether this user/instance/choice_option combo already exists
        $shortlistedOptionQuery = $this->ShortlistedOptions->find('all', [
            'conditions' => $data,
        ]);
        
        if($action === 'delete') {
            if($shortlistedOptionQuery->isEmpty()) {
                $this->set('response', 'No favourite to delete');
            }
            else {
                $shortlistedOption = $shortlistedOptionQuery->first();

                if ($this->ShortlistedOptions->delete($shortlistedOption)) {
                    $this->set('response', 'Favourite deleted');
                } else {
                    throw new InternalErrorException(__('Problem with deleting favourite'));
                }
            }
        }
        else {
            if(!$shortlistedOptionQuery->isEmpty()) {
                $this->set('response', 'Already a favourite');
            }
            else {
                $shortlistedOption = $this->ShortlistedOptions->newEntity($data);

                if ($this->ShortlistedOptions->save($shortlistedOption)) {
                    $this->set('response', 'Favourite added');
                } else {
                    throw new InternalErrorException(__('Problem with saving favourite'));
                }
            }
        }
    }
}
