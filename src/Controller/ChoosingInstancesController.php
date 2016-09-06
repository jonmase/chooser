<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;
use Cake\Network\Exception\MethodNotAllowedException;

/**
 * ChoosingInstances Controller
 *
 * @property \App\Model\Table\ChoosingInstancesTable $ChoosingInstances
 */
class ChoosingInstancesController extends AppController
{

    /**
     * Archive method
     * Displays the archive of previous choosing instances
     *
     * @return \Cake\Network\Response|null
     */
    public function archive()
    {
        $this->paginate = [
            'contain' => ['Choices']
        ];
        $choosingInstances = $this->paginate($this->ChoosingInstances);

        $this->set(compact('choosingInstances'));
        $this->set('_serialize', ['choosingInstances']);
    }

    /**
     * View method
     *
     * @param string|null $id Choosing Instance id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($choiceId = null)
    {
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        $choosingInstance = $this->ChoosingInstances->findActive($choiceId);
        
        $choice = $this->ChoosingInstances->Choices->get($choiceId);
        $sections = $this->ChoosingInstances->Choices->getDashboardSectionsFromId($choiceId, $this->Auth->user('id'));
        pr($choosingInstance);

        $this->set(compact('choosingInstance', 'choice', 'sections'));
        $this->set('_serialize', ['choosingInstance']);
    }

    /**
     * Save method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     */
    public function save($choiceId = null)
    {
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        if ($this->request->is('post')) {
            $this->viewBuilder()->layout('ajax');
            
            //Process the data
            $data = $this->ChoosingInstances->processForSave($this->request->data);
            $data['active'] = true;
            $data['choice_id'] = $choiceId;
            
            //pr($data);
            //exit;
            
            if(!empty($data['instance_id'])) {
                //Get the instance and patch entity
                $choosingInstance = $this->ChoosingInstances->get($data['instance_id']);
                $choosingInstance = $this->ChoosingInstances->patchEntity($choosingInstance, $data);
            }
            else {
                $choosingInstance = $this->ChoosingInstances->newEntity($data);
            }
            
            //pr($choosingInstance);
            //exit;
            
            if ($this->ChoosingInstances->save($choosingInstance)) {
                $this->set('response', 'Choosing settings saved');
                
                //$option = $this->Options->processForView($updatedChoicesOption, $choiceId);
                //pr($choosingInstance->toArray());
                //exit;
                $this->set('instance', $choosingInstance->toArray());
            } 
            else {
                throw new InternalErrorException(__('Problem with saving choosing settings'));
            }
        }
        else {
            throw new MethodNotAllowedException(__('Saving choosing settings requires POST'));
        }
    }

    /**
     * Edit method
     *
     * @param string|null $id Choosing Instance id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $choosingInstance = $this->ChoosingInstances->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $choosingInstance = $this->ChoosingInstances->patchEntity($choosingInstance, $this->request->data);
            if ($this->ChoosingInstances->save($choosingInstance)) {
                $this->Flash->success(__('The choosing instance has been saved.'));

                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The choosing instance could not be saved. Please, try again.'));
            }
        }
        $choices = $this->ChoosingInstances->Choices->find('list', ['limit' => 200]);
        $this->set(compact('choosingInstance', 'choices'));
        $this->set('_serialize', ['choosingInstance']);
    }

    /**
     * Delete method
     *
     * @param string|null $id Choosing Instance id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $choosingInstance = $this->ChoosingInstances->get($id);
        if ($this->ChoosingInstances->delete($choosingInstance)) {
            $this->Flash->success(__('The choosing instance has been deleted.'));
        } else {
            $this->Flash->error(__('The choosing instance could not be deleted. Please, try again.'));
        }

        return $this->redirect(['action' => 'index']);
    }
}
