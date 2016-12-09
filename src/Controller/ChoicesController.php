<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;

/**
 * Choices Controller
 *
 * @property \App\Model\Table\ChoicesTable $Choices
 */
class ChoicesController extends AppController
{
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
                $this->redirect(['controller' => 'options', 'action' => 'view', $choiceContext->choice_id]);
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
     * Dashboard method
     * Displays Choice management options that are available to this user
     *
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When choice record not found.
     */
    public function dashboard($id = null)
    {
        //Get the sections to show
        $sections = $this->Choices->getDashboardSectionsFromId($id, $this->Auth->user('id'));
        if(empty($sections)) {
            //User doesn't have permission to view any dashboard sections, so redirect to Choice view
            $this->redirect(['controller' => 'options', 'action' => 'view', $id]);
        }
        
        $choice = $this->Choices->get($id);

        $this->set(compact('choice', 'sections'));
    }
    
    /**
     * form method
     * Create the options form for the Choice
     * 
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When choice record not found.
     */
    public function form($id = null) {
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(!$isAdmin) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        $choice = $this->Choices->getChoiceWithProcessedExtraFields($id);
        
        //Get the sections to show in the menu  bar
        $sections = $this->Choices->getDashboardSectionsFromId($id, $this->Auth->user('id'));
        
        $this->set(compact('choice', 'sections'));
    }

    /**
     * formDefaults method
     * Save the settings for the defaults option form fields
     * 
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When choice record not found.
     */
    public function formDefaults($id = null) {
        $this->request->allowMethod(['post']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(!$isAdmin) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }

        $choice = $this->Choices->get($id);
        
        foreach($this->request->data as $field => $value) {
            $choice['use_' . $field] = filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }
        
        if($this->Choices->save($choice)) {
            $this->set('response', 'Default field settings saved');
        } 
        else {
            throw new InternalErrorException(__('Problem with saving default field settings'));
        }
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
                $this->redirect(['controller' => 'options', 'action' => 'view', $choiceContext->choice_id]);
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
                $this->redirect(['controller' => 'choices', 'action' => 'dashboard', $choiceContext->choice_id]);
            }
            $this->Flash->error('The Choice could not be linked. Please try again', ['key' => 'link-choice-error']);
        }
        else {
            $this->redirect(['controller' => 'choices', 'action' => 'add']);
        }
    }
    
    /**
     * Roles method
     * Displays, and allows editing of, additional roles for this Choice 
     *
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When choice record not found.
     */
    public function roles($id = null)
    {
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(!$isAdmin) {
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
        
        //Get the sections to show in the menu  bar
        $sections = $this->Choices->getDashboardSectionsFromId($id, $this->Auth->user('id'));
        
        $this->set(compact('choice', 'users', 'roleOptions', 'roleDescriptions', 'sections', 'userSortField'));
    }
    
    /**
     * roleSettings method
     * 
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When choice record not found.
     */
    public function roleSettings($id = null)
    {
        $this->request->allowMethod(['patch', 'post', 'put']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(!$isAdmin) {
            throw new ForbiddenException(__('Not permitted to view/edit Choice roles.'));
        }

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
}
