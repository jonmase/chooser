<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;

/**
 * Choices Controller
 *
 * @property \App\Model\Table\ChoicesTable $Choices
 */
class ChoicesController extends AppController
{

    /**
     * Index method
     *
     * @return \Cake\Network\Response|null
     */
    /*public function index()
    {
        $choices = $this->paginate($this->Choices);

        $this->set(compact('choices'));
        $this->set('_serialize', ['choices']);
    }*/

    /**
     * View method
     *
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($id = null)
    {
        $this->autoRender = false;
        pr("Choice view: " . $id);
        /*$choice = $this->Choices->get($id, [
            'contain' => ['LtiContext']
        ]);

        $this->set('choice', $choice);
        $this->set('_serialize', ['choice']);*/
    }
    
    /**
     * Add method
     * Allows Staff to link a Choice to this LTI Context
     * Displays the Choices available to the current user (i.e. those they have admin rights over)
     * User can choose an available Choice, create a new one
     * 
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not Staff or Admin
     */
    public function add()
    {
        // Get the tool from the session
        $session = $this->request->session();
        $tool = $session->read('tool');
        //pr($tool);
        
        //Make sure that the user is Staff or Admin
        if(!$tool->user->isStaff() && !$tool->user->isAdmin()) {
            throw new ForbiddenException(__('Not permitted to create Choice link.'));
        }
      
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $data['private'] = $data['indirect_access'] === 'on'?false:true;
            
            //Associate the new Choice with the current user, with Admin permissions
            $data['users'] = [
                [
                    'id' => $this->Auth->user('id'),
                    '_joinData' => ['admin' => true],
                ]
            ];
            
            //Associate the new Choice with the LTI context
            $data['choices_lti_context'] = [
                [
                    'lti_consumer_key' => $tool->consumer->getKey(),
                    'lti_context_id' => $tool->context->getId(),
                ]
            ];

            //Save everything
            $choice = $this->Choices->newEntity($data, [
                'associated' => ['Users._joinData', 'ChoicesLtiContext']
            ]);
            if($this->Choices->save($choice)) {
                //Redirect to the Choice
                $this->redirect(['controller' => 'choices', 'action' => 'view', $choice->id]);
            }
            $this->Flash->error('The new Choice could not be saved. Please try again', ['key' => 'new-choice-error']);
        }
        //Get the existing Choices that this user has Admin rights on
        $userId = $this->Auth->user('id');
        $choices = $this->Choices->getChoices($userId, 'admin');
        //pr($choices);
        $this->set(compact('choices'));
    }

    /**
     * Add method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     */
    /*public function add()
    {
        $choice = $this->Choices->newEntity();
        if ($this->request->is('post')) {
            $choice = $this->Choices->patchEntity($choice, $this->request->data);
            if ($this->Choices->save($choice)) {
                $this->Flash->success(__('The choice has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The choice could not be saved. Please, try again.'));
            }
        }
        $this->set(compact('choice'));
        $this->set('_serialize', ['choice']);
    }*/

    /**
     * Edit method
     *
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    /*public function edit($id = null)
    {
        $choice = $this->Choices->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $choice = $this->Choices->patchEntity($choice, $this->request->data);
            if ($this->Choices->save($choice)) {
                $this->Flash->success(__('The choice has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The choice could not be saved. Please, try again.'));
            }
        }
        $this->set(compact('choice'));
        $this->set('_serialize', ['choice']);
    }*/

    /**
     * Delete method
     *
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    /*public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $choice = $this->Choices->get($id);
        if ($this->Choices->delete($choice)) {
            $this->Flash->success(__('The choice has been deleted.'));
        } else {
            $this->Flash->error(__('The choice could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }*/
}
