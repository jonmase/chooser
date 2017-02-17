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
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * e.g. `$this->loadComponent('Security');`
     *
     * @return void
     */
    public function initialize()
    {
        parent::initialize();

        $this->loadComponent('Redirection');
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
        $tool = $this->SessionData->getLtiTool();
        
        //Check that there is not already a Choice associated with this context
        if($choiceContext = $this->Choices->ChoicesLtiContext->getContextChoice($tool)) {
            $this->Redirection->goToDashboardOrView($choiceContext->choice_id, $tool);
        }
        
        //Make sure that the user is Staff or Admin
        if(!$this->Choices->ChoicesUsers->isLTIStaffOrAdmin($tool)) {
            throw new ForbiddenException(__('Not permitted to create Choice link.'));
        }
      
        //If request is post, process the posted data
        if ($this->request->is('post')) {
            $data = $this->request->data;
            //$data['private'] = (isset($data['indirect_access']) && $data['indirect_access'] === 'on')?false:true;
            
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

            //Hydrate the Choice
            $choice = $this->Choices->newEntity($data, [
                'associated' => ['Users._joinData', 'ChoicesLtiContext']
            ]);
            
            //Save everything
            if($this->Choices->save($choice)) {
                //Add the choice to the session
                $session->write('choiceId', $choice->id);
                
                //Redirect to the Choice dashboard page
                $this->redirect(['controller' => 'choices', 'action' => 'dashboard']);
            }
            $this->Flash->error('The new Choice could not be saved. Please try again', ['key' => 'new-choice-error']);
        }
        
        //Get the existing Choices that this user has Admin rights on
        $choices = $this->Choices->getChoices($this->Auth->user('id'), 'admin');
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
    public function dashboard()
    {
        $choiceId = $this->SessionData->getChoiceId();
        $tool = $this->SessionData->getLtiTool();
        
        if(!$this->Choices->ChoicesUsers->isMoreThanViewer($choiceId, $this->Auth->user('id'), $tool)) {
            //If user is only viewer, redirect to the view page
            $this->redirect(['controller' => 'options', 'action' => 'view']);
        }
        
        //Get the choice
        $choice = $this->Choices->get($choiceId);
        
        //Get the sections to show
        $sections = $this->Choices->getDashboardSectionsForUser($choiceId, $this->Auth->user('id'), $tool);

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
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'), $this->request->session()->read('tool'));
        if(!$isAdmin) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        $choice = $this->Choices->getChoiceWithProcessedExtraFields($id);
        
        //Get the sections to show in the menu  bar
        $sections = $this->Choices->getDashboardSectionsForUser($id, $this->Auth->user('id'));
        
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
        $isAdmin = $this->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'), $this->request->session()->read('tool'));
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
        $tool = $this->SessionData->getLtiTool();
        
        //Check that there is not already a Choice associated with this context
        if($choiceContext = $this->Choices->ChoicesLtiContext->getContextChoice($tool)) {
            $this->Redirection->goToDashboardOrView($choiceContext->choice_id, $tool);
        }
        
        //Make sure that the user is Staff or Admin
        if(!$this->Choices->ChoicesUsers->isLTIStaffOrAdmin($tool)) {
            throw new ForbiddenException(__('Not permitted to create Choice link.'));
        }
      
        if ($this->request->is('post')) {
            //Associate the Choice with the LTI context
            $data = [
                'lti_consumer_key' => $tool->consumer->getKey(),
                'lti_context_id' => $tool->context->getId(),
                'choice_id' => $this->request->data['choice'],
            ];

            //Hydrate the Choice
            $choiceContext = $this->Choices->ChoicesLtiContext->newEntity($data);

            //Save everything
            if($this->Choices->ChoicesLtiContext->save($choiceContext)) {
                //Add the choice to the session
                $session->write('choiceId', $choice->id);
                
                //Redirect to the Choice
                $this->redirect(['controller' => 'choices', 'action' => 'dashboard']);
            }
            $this->Flash->error('The Choice could not be linked. Please try again', ['key' => 'link-choice-error']);
        }
        else {
            $this->redirect(['controller' => 'choices', 'action' => 'add']);
        }
    }
}
