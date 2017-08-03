<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;
use Cake\Network\Exception\NotFoundException;

/**
 * Users Controller
 *
 * @property \App\Model\Table\UsersTable $Users
 */
class UsersController extends AppController
{
	/**
     * Forbidden method
     *
     * @return void
     * @throws \Cake\Network\Exception\ForbiddenException
     */
    public function forbidden()
    {
		throw new ForbiddenException('Access Denied');
    }
    
    /**
     * get method
     * 
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Users or Choices record not found.
     */
    public function get()
    {
        //Make sure the user is an admin for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isAdmin = $this->Users->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to view users for this Choice.'));
        }
        
        $users = $this->Users->getForChoice($choiceId, $currentUserId);
        
        $this->set(compact('users'));
        $this->set('_serialize', ['users']);
       // pr($users);
    }
    
    
    /**
     * index method
     * Displays, and allows editing of, additional roles for this Choice 
     *
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When choice record not found.
     */
    public function index()
    {
        //Make sure the user is an admin for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isAdmin = $this->Users->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(!$isAdmin) {
            throw new ForbiddenException(__('Not permitted to view/edit Choice roles.'));
        }
        
        //pr($this->request->session()->read());

        $choice = $this->Users->ChoicesUsers->Choices->get($choiceId);
        
        //$defaultRolesArray = explode(',', $choice->instructor_default_roles);
        $defaultRolesArray = $this->Users->ChoicesUsers->Choices->splitInstructorDefaultRoles($choice->instructor_default_roles);
        //$roles = $this->Users->ChoicesUsers->getAllRoles();
        $roles = $this->Users->ChoicesUsers->getNonViewRoles();
        
        $roleIndexesById = [];
        $defaultRolesObject = [];
        foreach($roles as $index => $role) {
            $defaultRolesObject[$role['id']] = in_array($role['id'], $defaultRolesArray);
            $roleIndexesById[$role['id']] = $index;
        }
        $choice->instructor_default_roles = $defaultRolesObject;
        
        //Get the sections to show in the menu  bar
        $sections = $this->Users->ChoicesUsers->Choices->getDashboardSectionsForUser($choiceId, $currentUserId, $tool);
        
        $this->set(compact('choice', 'currentUserId', 'roles', 'roleIndexesById', 'sections'));
    }
    
    /**
     * roleSettings method
     * 
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When choice record not found.
     */
    public function roleSettings()
    {
        $this->request->allowMethod(['patch', 'post', 'put']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isAdmin = $this->Users->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(!$isAdmin) {
            throw new ForbiddenException(__('Not permitted to view/edit Choice roles.'));
        }

        $choice = $this->Users->ChoicesUsers->Choices->get($choiceId);
        
        $data = [];
        
        //Set the notify value
        if(isset($this->request->data['notify'])) {
            $data['notify_additional_permissions'] = filter_var($this->request->data['notify'], FILTER_VALIDATE_BOOLEAN);
        }
        
        //Set the default roles value
        $defaultRoles = [];
        if(isset($this->request->data['defaultRoles'])) {
            foreach($this->request->data['defaultRoles'] as $role => $default) {
                if(filter_var($default, FILTER_VALIDATE_BOOLEAN)) {
                    $defaultRoles[] = trim($role);
                }
            }
        }
        $data['instructor_default_roles'] = implode(',', $defaultRoles);
        
        $choice = $this->Users->ChoicesUsers->Choices->patchEntity($choice, $data);

        if ($this->Users->ChoicesUsers->Choices->save($choice)) {
            $this->set('response', 'Role settings saved');
        }
        else {
            throw new InternalErrorException(__('Problem with saving role settings'));
        }
    }

    /**
     * add method
     * 
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Users or Choices record not found.
     */
    public function add()
    {
        $this->request->allowMethod(['post']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isAdmin = $this->Users->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to add users to this Choice.'));
        }

        //Make sure some roles have been selected, and otherwise delete the users
        $rolesToSave = [];
        //Use the first user - all user will have the same roles
        foreach($this->request->data['users'][0]['roles'] as $role => $value) {
            if(filter_var($value, FILTER_VALIDATE_BOOLEAN)) {
                $rolesToSave[] = $role;
            }
        }
        if(empty($rolesToSave)) {
            throw new InternalErrorException(__('No additional roles set'));
        }
        else {
            $users = [];
            foreach($this->request->data['users'] as $userData) {
                //If user ID is not set in the data (it can be set to false), User has not yet been searched for
                if(!isset($userData['id'])) {
                    $user = $this->Users->findByUsernameThenEmail($userData['username']);
                    $userData['id'] = $user['id'];
                }
                
                //If user has been found, get that user, with ChoicesUsers record for this choice, if it exists
                if($userData['id']) {
                    $user = $this->Users->get($userData['id'], [
                        'contain' => [
                            'Choices' => function ($q) use ($choiceId) {
                                return $q
                                    ->select(['id'])
                                    ->where(['Choices.id' => $choiceId]);
                            }
                        ]
                    ]);
                }
                
                //If we don't have a user yet, create one from the username in the request data
                if(empty($user)) {
                    $user = $this->Users->newEntity();
                    $user->username = $userData['username'];
                }
                
                //If user->choices is empty, user is not already associated with this choice
                if(empty($user->choices)) {
                    $choice = $this->Users->Choices->get($choiceId, ['fields' => ['id']]);
                    $choice->_joinData = $this->Users->ChoicesUsers->newEntity();
                }
                else {
                    $choice = $user->choices[0];
                }
                
                //Set the roles values
                //Start with blank values for each role
                $nonViewRoles = $this->Users->ChoicesUsers->getNonViewRoles();
                foreach($nonViewRoles as $role) {
                    $choice->_joinData->$role['id'] = false;
                }
                
                //If user is admin, set only admin to true
                if(array_search('admin', $rolesToSave) !== false) {
                    $choice->_joinData->admin = true;
                }
                //Otherwise, set each of the selected roles to true
                else {
                    foreach($userData['roles'] as $role => $value) {
                        $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                        $choice->_joinData->$role = $value;
                    }
                }
                
                $user->choices = [$choice];
                $users[] = $user;
            }

            //$user->_joinData->notify_additional_permissions = $this->request->data['notify'];
            
            //pr($users); exit;
            if ($this->Users->saveMany($users)) {
                //Get the updated users list and return it
                $users = $this->Users->getForChoice($choiceId, $currentUserId);
                //pr($users); exit;
                $this->set(compact('users'));
                
                $this->set('response', 'Additional permissions set');
            } 
            else {
                throw new InternalErrorException(__('Problem with adding user'));
            }
        }
    }
    
    /**
     * delete method
     * 
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     */
    public function delete()
    {
        $this->request->allowMethod(['post']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isAdmin = $this->Users->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to remove user permissions for this Choice.'));
        }

        //Delete all the users given by ID in $this->request->data['users']
        if ($this->Users->ChoicesUsers->deleteAll(['user_id IN' => $this->request->data['users'], 'choice_id' => $choiceId])) {
            //Get the updated users list and return it
            $users = $this->Users->getForChoice($choiceId, $currentUserId);
            $this->set(compact('users'));
            
            $this->set('response', 'Permissions removed');
        } 
        else {
            throw new InternalErrorException(__('Problem with removing user permissions'));
        }
    }
    
    /**
     * edit method
     * 
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Choice record not found.
     */
    /*public function edit()
    {
        $this->request->allowMethod(['post']);
        $this->viewBuilder()->layout('ajax');
        
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Users->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }

        $choice = $this->Users->Choices->get($choiceId); //Get the choice
        //$choice->_joinData = $this->Users->ChoicesUsers->newEntity();
        
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
            $choicesUserQuery = $this->Users->ChoicesUsers->find('all', [
                'fields' => ['id', 'user_id', 'choice_id'],
                'conditions' => [
                    'ChoicesUsers.choice_id' => $id,
                    'ChoicesUsers.user_id' => $userId,
                ],
            ]);
            $choicesUser = $choicesUserQuery->first();
            
            //If no roles are set for this user, delete them from the ChoicesUsers table
            if($noRoles) {
                if($this->Users->ChoicesUsers->delete($choicesUser)) {
                    $deletedUsers[] = $userId;
                    $userCount++;
                }
                else {
                    $failedUsers[] = $userId;
                }
            }
            else {
                //Get the user record from the DB
                $user = $this->Users->get($userId);

                //Patch the ChoicesUsers entity with the new roles, for the _joinData
                $choice->_joinData = $this->Users->ChoicesUsers->patchEntity($choicesUser, $roles);
                $user->choices = [$choice]; //Add the choice to the user, as the first and member of a choices array

                //Save the user, adding them to the savedUsers array that will be sent back to the view
                if($this->Users->save($user)) {
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
        $roles = $this->Users->ChoicesUsers->processRoles($choice->_joinData, true);
        $this->set('roles', $roles);
    }*/

    /**
     * findUser method
     * Searches for a user, firstly by username then by email address
     * 
     * @param string searchValue Username/email address to search for
     * @return \Cake\Network\Response|null Returns user record
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When user not found.
     */
    public function findUser($searchValue = null) {
        //Make sure there is a choice ID and search value
        $choiceId = $this->SessionData->getChoiceId();
        if(!$choiceId || !$searchValue) {
            throw new InternalErrorException(__('Problem with finding user - insufficient information'));
        }
        
        //Make sure the user is an admin for this Choice
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isAdmin = $this->Users->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to look up users for this Choice.'));
        }
        
        $user = $this->Users->findByUsernameThenEmail($searchValue);
        
        if(empty($user)) {
            //throw new NotFoundException(__('User not found.'));
            $message =  'That user wasn\'t found in Chooser, but you can still give them additional roles. They will have these roles when they first access the Choice.';
            $user = false;
        }
        else {
            //Generate the user found message
            $message = 'User found: ';
            if($user->fullname === null) {
                $message .= $user->username;
            }
            else {
                $message .= $user->fullname;
                $message .= ' (';
                $message .= $user->username;
                if($user->email !== null && $user->username !== $user->email) {
                    $message .= ', ' + $user->email;
                }
                $message .= ')';
            }
        }
        
        $this->set(compact('user', 'message'));
        $this->set('_serialize', ['user', 'message']);
    }
}
