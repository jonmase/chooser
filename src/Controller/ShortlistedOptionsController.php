<?php
namespace App\Controller;

use App\Controller\AppController;

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
     * Add method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     */
    /*public function add()
    {
        $shortlistedOption = $this->ShortlistedOptions->newEntity();
        if ($this->request->is('post')) {
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
