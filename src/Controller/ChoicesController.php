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
    private function _cleanString($string) {
        return strtolower(preg_replace('/[^\w]/', '_', $string));
    }

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
        $roles = $this->Choices->ChoicesUsers->getRolesAsIDsArray($id, $this->Auth->user('id'));
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
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Choice record not found.
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
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Choice record not found.
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
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Choice record not found.
     * @throws \Cake\Datasource\Exception\InternalErrorException When save fails.
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

                $this->set('response', 'Additional permissions granted');
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
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Choice record not found.
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
            //pr($this->request->data); exit;
            $choice = $this->Choices->get($id); //Get the choice
            //$choice->_joinData = $this->Choices->ChoicesUsers->newEntity();
            
            //Set the roles
            $roles = [];
            $noRoles = true;    //Test whether there are any additional roles
            foreach($this->request->data['editRoles'] as $role => $value) {
                $boolValue = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                $roles[$role] = $boolValue;
                if($boolValue) { $noRoles = false; }
            }
            
            $userCount = 0;
            $savedUsers = [];
            $deletedUsers = [];
            $failedUsers = [];
            
            foreach($this->request->data['users'] as $userId) { //Loop through the submitted users
                $userId += 0;   //Make sure userId is integer
                //Get the ChoicesUsers record for this choice/user
                $choicesUserQuery = $this->Choices->ChoicesUsers->find('all', [
                    'fields' => ['id', 'user_id', 'choice_id'],
                    'conditions' => [
                        'ChoicesUsers.choice_id' => $id,
                        'ChoicesUsers.user_id' => $userId,
                    ],
                ]);
                $choicesUser = $choicesUserQuery->first();
                //If no roles are set for this user, delete them from the ChoicesUsers table
                if($noRoles) {
                    if($this->Choices->ChoicesUsers->delete($choicesUser)) {
                        $deletedUsers[] = $userId;
                        $userCount++;
                    }
                    else {
                        $failedUsers[] = $userId;
                    }
                }
                else {
                    //Get the user record from the DB
                    $user = $this->Choices->Users->get($userId);

                    //Patch the ChoicesUsers entity with the new roles, for the _joinData
                    $choice->_joinData = $this->Choices->ChoicesUsers->patchEntity($choicesUser, $roles);
                    $user->choices = [$choice]; //Add the choice to the user, as the first and member of a choices array

                    //Save the user, adding them to the savedUsers array that will be sent back to the view
                    if($this->Choices->Users->save($user)) {
                        $savedUsers[] = $user->id;
                        $userCount++;
                    }
                    //Add any users that failed to save to the failedUsers array
                    else {
                        $failedUsers[] = $user->id;
                    }
                }
            }
            
            $s = $userCount>1?'s':'';
            if($noRoles) {
                $response = 'Additional permissions removed for ' . $userCount . ' user' . $s;
            }
            else {
                $response = 'Additional permissions updated for ' . $userCount . ' user' . $s;
            }
            $this->set('response', $response);
            $this->set('savedUsers', $savedUsers);   //Pass the saved users to the view
            $this->set('deletedUsers', $deletedUsers);   //Pass the deleted users to the view
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
     * form method
     * Create the options form for the Choice
     * 
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function form($id = null) {
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        $choice = $this->Choices->get($id, [
            'contain' => [
                'ExtraFields' => ['ExtraFieldOptions']
            ]
        ]);
        
        foreach($choice['extra_fields'] as &$extra) {
            $extra['name'] = $this->_cleanString($extra['label']);
        }
        
        pr($choice);
        $this->set(compact('choice'));
    }

    /**
     * formDefaults method
     * Save the settings for the defaults option form fields
     * 
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Choice record not found.
     * @throws \Cake\Datasource\Exception\InternalErrorException When save fails.
     */
    public function formDefaults($id = null) {
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }

        if ($this->request->is('post')) {
            $choice = $this->Choices->get($id);
            
            foreach($this->request->data as $field => $value) {
                $choice['use_' . $field] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            }
            
            //pr($this->request->data);
           // pr($choice);
            if($this->Choices->save($choice)) {
                $this->set('response', 'Default field settings saved');
            } 
            else {
                throw new InternalErrorException(__('Problem with saving default field settings'));
            }
        }
        else {
            throw new MethodNotAllowedException(__('Saving default field settings requires POST'));
        }
    }

    /**
     * formExtra method
     * Save an extra field to the option form
     * 
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Choice record not found.
     * @throws \Cake\Datasource\Exception\InternalErrorException When save fails.
     */
    public function formExtra($id = null) {
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }

        if ($this->request->is('post')) {
            //pr($this->request->data);
            $data = $this->request->data;
            $data['choice_id'] = $id;
            
            //Process bool fields
            $boolFields = [
                'required',
                'show_to_students',
                'in_user_defined_form',
                'sortable',
                'filterable',
                'rule_category',
            ];
            foreach($boolFields as $fieldName) {
                $data[$fieldName] = isset($data[$fieldName])?filter_var($data[$fieldName], FILTER_VALIDATE_BOOLEAN):false;
            }
            
            //Process non-standard fields
            if($data['type'] === 'list') {
                //List - list_type, list_options (both required)
                if(empty($data['list_type']) || empty($data['list_options'])) {
                    throw new InternalErrorException(__('Please specify list type and options'));
                }
                else {
                    //$extraFieldNames = ['list_type'];
                    //$data = $this->_processExtraFields($data, $extraFieldNames);
                    $data['type'] = $data['list_type'];
                    unset($data['list_type']);
                    
                    $listOptions = explode("\n", $data['list_options']);
                    $data['extra_field_options'] = [];
                    foreach($listOptions as $option) {
                        $optionData = [];
                        $optionData['label'] = $option;
                        $optionData['value'] = $this->_cleanString($option);
                        //$data['extra_field_options'][] = $this->Choices->ExtraFields->ExtraFieldOptions->newEntity($optionData);
                        $data['extra_field_options'][] = $optionData;
                    }
                    unset($data['list_options']);
                }
            }
            if($data['type'] === 'number') {
                //Number - number_min, number_max (neither required)
                $extraFieldNames = ['number_min', 'number_max'];
                $data = $this->_processExtraFields($data, $extraFieldNames);
            }
            //pr($data);
            //Create entity 
            $extraField = $this->Choices->ExtraFields->newEntity($data, ['associated' => ['ExtraFieldOptions']]);
            //pr($extraField);
            //exit;
            
            if($this->Choices->ExtraFields->save($extraField)) {
                $this->set('response', 'Extra field added');
            } 
            else {
                throw new InternalErrorException(__('Problem with adding extra field'));
            }
        }
        else {
            throw new MethodNotAllowedException(__('Adding extra field requires POST'));
        }
    }
    
    /**
     * _processExtraFields method
     * Adds extra fields as JSON to 'extra' in data and removes those extra fields from data
     * 
     * @param array $data
     * @param array|null $extraFieldNames - the fields that will be moved into 'extra'
     * @return array $data - modified data array
     */
    private function _processExtraFields($data, $extraFieldNames = null) {
        $extra = [];
        foreach($extraFieldNames as $fieldName) {
            $extra[$fieldName] = $data[$fieldName];
            unset($data[$fieldName]);
        }
        $data['extra'] = json_encode($extra);
        return $data;
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
