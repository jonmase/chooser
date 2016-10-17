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
     * Index method
     *
     * @return \Cake\Network\Response|null
     */
    /*public function index()
    {
        $this->paginate = [
            'contain' => ['Users', 'ChoosingInstances', 'ChoicesOptions']
        ];
        $shortlistedOptions = $this->paginate($this->ShortlistedOptions);

        $this->set(compact('shortlistedOptions'));
        $this->set('_serialize', ['shortlistedOptions']);
    }*/

    /**
     * View method
     *
     * @param string|null $id Shortlisted Option id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    /*public function get($id = null)
    {
        $shortlistedOption = $this->ShortlistedOptions->get($id, [
            'contain' => ['Users', 'ChoosingInstances', 'ChoicesOptions']
        ]);

        $this->set('shortlistedOption', $shortlistedOption);
        $this->set('_serialize', ['shortlistedOption']);
    }*/

    /**
     * Davourite method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not a Viewer
	 * @throws \Cake\Datasource\Exception\InternalErrorException When save fails.
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
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
        $isViewer = $this->ShortlistedOptions->ChoicesOptions->Choices->ChoicesUsers->isViewer($instance['choice_id'], $this->Auth->user('id'));
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

    /**
     * Edit method
     *
     * @param string|null $id Shortlisted Option id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    /*public function edit($id = null)
    {
        $shortlistedOption = $this->ShortlistedOptions->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $shortlistedOption = $this->ShortlistedOptions->patchEntity($shortlistedOption, $this->request->data);
            if ($this->ShortlistedOptions->save($shortlistedOption)) {
                $this->Flash->success(__('The shortlisted option has been saved.'));

                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The shortlisted option could not be saved. Please, try again.'));
            }
        }
        $users = $this->ShortlistedOptions->Users->find('list', ['limit' => 200]);
        $choosingInstances = $this->ShortlistedOptions->ChoosingInstances->find('list', ['limit' => 200]);
        $choicesOptions = $this->ShortlistedOptions->ChoicesOptions->find('list', ['limit' => 200]);
        $this->set(compact('shortlistedOption', 'users', 'choosingInstances', 'choicesOptions'));
        $this->set('_serialize', ['shortlistedOption']);
    }*/

    /**
     * Delete method
     *
     * @param string|null $id Shortlisted Option id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    /*public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $shortlistedOption = $this->ShortlistedOptions->get($id);
        if ($this->ShortlistedOptions->delete($shortlistedOption)) {
            $this->Flash->success(__('The shortlisted option has been deleted.'));
        } else {
            $this->Flash->error(__('The shortlisted option could not be deleted. Please, try again.'));
        }

        return $this->redirect(['action' => 'index']);
    }*/
}
