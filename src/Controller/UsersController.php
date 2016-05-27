<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;
use Cake\Network\Exception\MethodNotAllowedException;

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
     * add method
     * 
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Choice record not found.
     * @throws \Cake\Datasource\Exception\InternalErrorException When save fails.
     */
    public function add($id = null)
    {
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Users->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to add users to this Choice.'));
        }

        if ($this->request->is('post')) {
            //pr($this->request->data);
            
            //If user ID is not set in the data (it can be set to false), User has not yet been searched for
            if(!isset($this->request->data['id'])) {
                $user = $this->Users->findByUsernameThenEmail($this->request->data['username']);
            }
            //User has already been searched for and found
            else if($this->request->data['id']) {
                $user = $this->Users->get($this->request->data['id']);
            }
            
            //If we don't have a user yet, create one from the username in the request data
            if(empty($user)) {
                $user = $this->Users->newEntity();
                $user->username = $this->request->data['username'];
            }
            
            //TODO: Make sure there isn't already a ChoicesUsers record for this user and Choice
            
            $choice = $this->Users->Choices->get($id);
            $choice->_joinData = $this->Users->ChoicesUsers->newEntity();
            //$user->_joinData->notify_additional_permissions = $this->request->data['notify'];
            
            //Set the roles values
            $defaultRoles = [];
            foreach($this->request->data['addRoles'] as $role => $value) {
                $choice->_joinData->$role = filter_var($value, FILTER_VALIDATE_BOOLEAN);
            }
            
            $user->choices = [$choice];
            
            //pr($user);
            //pr($choice);
            //exit;
            
            if ($this->Users->save($user)) {
                //Get roles from _joinData, including view role
                $user->roles = $this->Users->ChoicesUsers->processRoles($choice->_joinData, true);  
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
     * edit method
     * 
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Choice record not found.
     */
    public function edit($id = null)
    {
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Users->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }

        if ($this->request->is('post')) {
            //pr($this->request->data); exit;
            $choice = $this->Users->Choices->get($id); //Get the choice
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
        }
        else {
            throw new MethodNotAllowedException(__('Editing users requires POST'));
        }
    }

    /**
     * findUser method
     * Searches for a user, firstly by username then by email address
     * 
     * @param string searchValue Username/email address to search for
     * @return \Cake\Network\Response|null Returns user record
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When user not found.
     */
    public function findUser($choiceId = null, $searchValue = null) {
        if(!$choiceId || !$searchValue) {
            throw new RecordNotFoundException(__('Please provide a choice ID and search value.'));
        }
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Users->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to look up users for this Choice.'));
        }

        $user = $this->Users->findByUsernameThenEmail($searchValue);
        
        if(empty($user)) {
            throw new ForbiddenException(__('User not found.'));
        }
        
        $this->set(compact('user'));
        $this->set('_serialize', ['user']);
    }
}
