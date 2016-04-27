<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;
use Cake\Network\Exception\MethodNotAllowedException;

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
        $choice = $this->Choices->get($id);

        $this->set('choice', $choice);
        //$this->set('_serialize', ['choice']);
    }
    
    /**
     * Dashboard method
     * Displays Choice management options that are available to this user
     *
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not Staff or Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function dashboard($id = null)
    {
        //Get user's roles for this Choice
        $roles = $this->Choices->ChoicesUsers->getRoles($id, $this->Auth->user('id'));
        //Make sure user has additional permissions for this Choice
        if(empty($roles)) {
            throw new ForbiddenException(__('Not permitted to view Choice dashboard.'));
        }
        
        $choice = $this->Choices->get($id);

        $this->set(compact('choice', 'roles'));
        //$this->set('_serialize', ['choice']);
    }
    
    /**
     * Roles method
     * Displays, and allows editing of, additional roles for this Choice 
     *
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function roles($id = null)
    {
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to view/edit Choice roles.'));
        }

        $userSortField = 'username';
        $choice = $this->Choices->get($id, [
            'contain' => [
                'Users' => [    //Include the users
                    'sort' => ['Users.' . $userSortField => 'ASC'], 
                    //'conditions' => ['Users.id <>' => $this->Auth->user('id')]  //exclude self
                ]
            ]
        ]);
        $users = $choice->users;

        unset($choice->users);
        foreach($users as $user) {
            //Get roles from _joinData, including view role
            $user->roles = $this->Choices->ChoicesUsers->processRoles($user->_joinData, true);  
            unset($user->_joinData);
            
            if($user->id === $this->Auth->user('id')) {
                $user->current = true;
            }
        }
        
        $defaultRolesArray = explode(',', $choice->instructor_default_roles);
        $roleOptions = $this->Choices->ChoicesUsers->getAllRoles();
        
        $defaultRolesObject = [];
        foreach($roleOptions as $role) {
            $defaultRolesObject[$role['id']] = in_array($role['id'], $defaultRolesArray);
        }
        $choice->instructor_default_roles = $defaultRolesObject;
        //pr($roleOptions); 
        //pr($defaultRolesObject); 
        //exit;
        
        $this->set(compact('choice', 'users', 'roleOptions', 'roleDescriptions', 'userSortField'));
        //$this->set('_serialize', ['choice']);
    }
    
    /**
     * roleSettings method
     * 
     *
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     */
    public function roleSettings($id = null)
    {
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to view/edit Choice roles.'));
        }

        if ($this->request->is(['patch', 'post', 'put'])) {
            $choice = $this->Choices->get($id, [
                'contain' => []
            ]);
            
            $data = [];
            
            //Set the notify value
            $data['notify_additional_permissions'] = filter_var($this->request->data['notify'], FILTER_VALIDATE_BOOLEAN);
            
            //Set the default roles value
            $defaultRoles = [];
            foreach($this->request->data['defaultRoles'] as $role => $default) {
                if(filter_var($default, FILTER_VALIDATE_BOOLEAN)) {
                    $defaultRoles[] = $role;
                }
            }
            $data['instructor_default_roles'] = implode(',', $defaultRoles);
            
            $choice = $this->Choices->patchEntity($choice, $data);

            if ($this->Choices->save($choice)) {
                $this->set('response', 'Role settings saved');
            } 
            else {
                throw new InternalErrorException(__('Problem with saving role settings'));
            }
        }
        else {
            throw new MethodNotAllowedException(__('Role settings requires POST, PUT or PATCH'));
        }
    }
    
    


    /**
     * addUser method
     * 
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     */
    public function addUser($id = null)
    {
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to add users to this Choice.'));
        }

        if ($this->request->is('post')) {
            //pr($this->request->data);
            
            //If user ID is not set in the data (it can be set to false), User has not yet been searched for
            if(!isset($this->request->data['id'])) {
                $user = $this->Choices->Users->findByUsernameThenEmail($this->request->data['username']);
            }
            //User has already been searched for and found
            else if($this->request->data['id']) {
                $user = $this->Choices->Users->get($this->request->data['id']);
            }
            //Otherwise, user does not exist in the system
            //else {
            //}
            
            //If we don't have a user yet, create one from the username in the request data
            if(empty($user)) {
                $user = $this->Choices->Users->newEntity();
                $user->username = $this->request->data['username'];
            }
            
            //TODO: Make sure there isn't already a ChoicesUsers record for this user and Choice
            
            $choice = $this->Choices->get($id);
            $choice->_joinData = $this->Choices->ChoicesUsers->newEntity();
            //$user->_joinData->notify_additional_permissions = $this->request->data['notify'];
            //Set the roles values
            $defaultRoles = [];
            foreach($this->request->data['addRoles'] as $role => $value) {
                $choice->_joinData->$role = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            }
            
            $user->choices = [$choice];
            
            //pr($user);
            ///pr($choice);
            //exit;
            
            //there is a user ID, 
            //if(isset($user->id)

            //if ($this->Choices->Users->link($choice, [$user])) {
            if ($this->Choices->Users->save($user)) {
                //Get roles from _joinData, including view role
                $user->roles = $this->Choices->ChoicesUsers->processRoles($choice->_joinData, true);  
                unset($user->choices);

                $this->set('response', 'User saved');
                $this->set('user', $user);
            } 
            else {
                throw new InternalErrorException(__('Problem with adding user'));
            }
        }
        else {
            throw new MethodNotAllowedException(__('Adding users requires POST'));
        }
    }
    
    /**
     * editUser method
     * 
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     */
    public function editUser($id = null)
    {
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }

        if ($this->request->is('post')) {
            //pr($this->request->data);
            $choice = $this->Choices->get($id); //Get the choice
            //$choice->_joinData = $this->Choices->ChoicesUsers->newEntity();
            
            //Set the roles
            $roles = [];
            foreach($this->request->data['editRoles'] as $role => $value) {
                $roles[$role] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            }
            
            $savedUsers = [];
            $failedUsers = [];
            foreach($this->request->data['users'] as $userId) { //Loop through the submitted users
                //Get the user record from the DB
                $user = $this->Choices->Users->get($userId);
                
                //Get the ChoicesUsers record for this choice/user
                $choicesUser = $this->Choices->ChoicesUsers->find('all', [
                    'fields' => ['id', 'user_id', 'choice_id'],
                    'conditions' => [
                        'ChoicesUsers.choice_id' => $id,
                        'ChoicesUsers.user_id' => $userId,
                    ],
                ]);

                //Patch the ChoicesUsers entity with the new roles, for the _joinData
                $choice->_joinData = $this->Choices->ChoicesUsers->patchEntity($choicesUser->first(), $roles);
                $user->choices = [$choice]; //Add the choice to the user, as the first and member of a choices array

                //Save the user, adding them to the savedUsers array that will be sent back to the view
                if($this->Choices->Users->save($user)) {
                    $savedUsers[] = $user->id;
                }
                //Add any users that failed to save to the failedUsers array
                else {
                    $failedUsers[] = $user->id;
                }
            }
            
            $this->set('response', 'User roles updated');
            $this->set('savedUsers', $savedUsers);   //Pass the saved users to the view
            $this->set('failedUsers', $failedUsers);   //Pass the failed users to the view
           
            //Process the roles that have been given the users and pass them to the view
            $roles = $this->Choices->ChoicesUsers->processRoles($choice->_joinData, true);
            $this->set('roles', $roles);
        }
        else {
            throw new MethodNotAllowedException(__('Editing users requires POST'));
        }
    }
    
    /**
     * Add method
     * Displays the Choices available to the current user (i.e. those they have admin rights over)
     * User can choose an available Choice (which then uses link method), create a new one
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
        
        //Check that there is not already a Choice associated with this context
        if($choiceContext = $this->Choices->ChoicesLtiContext->getContextChoice($tool)) {
            //Redirect users with more than view role to Choice dashboard page
            if($this->Choices->ChoicesUsers->hasAdditionalRoles($choiceContext->choice_id, $this->Auth->user('id'))) {
                $this->redirect(['controller' => 'choices', 'action' => 'dashboard', $choiceContext->choice_id]);
            }
            //Redirect users with view role to Choice view page
            else {
                $this->redirect(['controller' => 'choices', 'action' => 'view', $choiceContext->choice_id]);
            }
        }
        
        //Make sure that the user is Staff or Admin
        if(!$tool->user->isStaff() && !$tool->user->isAdmin()) {
            throw new ForbiddenException(__('Not permitted to create Choice link.'));
        }
      
        if ($this->request->is('post')) {
            $data = $this->request->data;
            $data['private'] = (isset($data['indirect_access']) && $data['indirect_access'] === 'on')?false:true;
            
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
                //Redirect to the Choice dashboard page
                $this->redirect(['controller' => 'choices', 'action' => 'dashboard', $choice->id]);
            }
            $this->Flash->error('The new Choice could not be saved. Please try again', ['key' => 'new-choice-error']);
        }
        
        //Get the existing Choices that this user has Admin rights on
        $userId = $this->Auth->user('id');
        $choices = $this->Choices->getChoices($userId, 'admin');
        $this->set(compact('choices'));
    }

    /**
     * Link method
     * Link a Choice to the LTI Context
     * 
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not Staff or Admin
     */
    public function link()
    {
        // Get the tool from the session
        $session = $this->request->session();
        $tool = $session->read('tool');
        
        //Check that there is not already a Choice associated with this context
        if($choiceContext = $this->Choices->ChoicesLtiContext->getContextChoice($tool)) {
            //Redirect users with more than view role to Choice dashboard page
            if($this->Choices->ChoicesUsers->hasAdditionalRoles($choiceContext->choice_id, $this->Auth->user('id'))) {
                $this->redirect(['controller' => 'choices', 'action' => 'dashboard', $choiceContext->choice_id]);
            }
            //Redirect users with view role to Choice view page
            else {
                $this->redirect(['controller' => 'choices', 'action' => 'view', $choiceContext->choice_id]);
            }
        }
        
        //Make sure that the user is Staff or Admin
        if(!$tool->user->isStaff() && !$tool->user->isAdmin()) {
            throw new ForbiddenException(__('Not permitted to create Choice link.'));
        }
      
        if ($this->request->is('post')) {
            //Associate the Choice with the LTI context
            $data = [
                'lti_consumer_key' => $tool->consumer->getKey(),
                'lti_context_id' => $tool->context->getId(),
                'choice_id' => $this->request->data['choice'],
            ];

            //Save everything
            $choiceContext = $this->Choices->ChoicesLtiContext->newEntity($data);

            if($this->Choices->ChoicesLtiContext->save($choiceContext)) {
                //Redirect to the Choice
                $this->redirect(['controller' => 'choices', 'action' => 'view', $choiceContext->choice_id]);
            }
            $this->Flash->error('The Choice could not be linked. Please try again', ['key' => 'link-choice-error']);
        }
        else {
            $this->redirect(['controller' => 'choices', 'action' => 'add']);
        }
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
