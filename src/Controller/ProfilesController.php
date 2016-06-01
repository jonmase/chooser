<?php
namespace App\Controller;

use App\Controller\AppController;

/**
 * Profiles Controller
 *
 * @property \App\Model\Table\ProfilesTable $Profiles
 */
class ProfilesController extends AppController
{
    /**
     * View method
     *
     * @param string|null $choiceId Choice id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($choiceId = null)
    {
        $choice = $this->Profiles->Users->Choices->get($choiceId);

        $this->set(compact('choice'));

        //pr($this->Auth->user());
        
        $profileQuery = $this->Profiles->findByUser_id($this->Auth->user('id'), [
            //'contain' => ['Users']
        ]);
        $profile = $profileQuery->first();
        
        //If profile is empty, get whatever info we have from the users table
        if(empty($profile)) {
            $user = $this->Auth->user();
            $profile = [
                'user_id' => $user['id'],
                'firstname' => $user['firstname'],
                'lastname' => $user['lastname'],
                'email' => $user['email'],
            ];
        }
        //pr($profile);

        $this->set('profile', $profile);
        //$this->set('_serialize', ['profile']);
    }
    
    /**
     * save method
     *
     * @param string|null $id Profile id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function save($id = null)
    {
        $choice = $this->Profiles->Users->Choices->get($id);

        $this->set(compact('choice'));

        /*$profile = $this->Profiles->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $profile = $this->Profiles->patchEntity($profile, $this->request->data);
            if ($this->Profiles->save($profile)) {
                $this->Flash->success(__('The profile has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The profile could not be saved. Please, try again.'));
            }
        }
        $users = $this->Profiles->Users->find('list', ['limit' => 200]);
        $this->set(compact('profile', 'users'));
        $this->set('_serialize', ['profile']);*/
    }
}
