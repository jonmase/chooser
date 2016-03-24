<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;

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
