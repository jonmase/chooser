<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;

/**
 * Rules Controller
 *
 * @property \App\Model\Table\RulesTable $Rules
 */
class RulesController extends AppController
{
    /**
     * Get method
     * Return the rules for a choice
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Rules record not found.
     */
    public function get($choiceId = null, $action = 'settings') {
        //Make sure the user is an admin for this Choice or the Choice is visible to viewers
        $isAdmin = $this->Rules->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            //TODO: if(Choosing Instance is not available to viewers) {
                throw new ForbiddenException(__('Not permitted to view rules for this Choice.'));
            //}
        }
        
        list($rules, $ruleIndexesById) = $this->Rules->getForChoice($choiceId);
        
        if($action === 'settings') {
            $ruleCategoryFields = $this->Rules->ExtraFields->getRuleCategoryFields($choiceId);
            $this->set(compact('rules', 'ruleIndexesById', 'ruleCategoryFields'));
            $this->set('_serialize', ['rules', 'ruleIndexesById', 'ruleCategoryFields']);
        }
        else {
            $this->set(compact('rules', 'ruleIndexesById'));
            $this->set('_serialize', ['rules', 'ruleIndexesById']);
        }
    }

    /**
     * Save method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Rules record not found.
     */
    public function save($choiceId = null)
    {
        $this->request->allowMethod(['post']);

        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Rules->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        $data = $this->request->data;
        $data['hard'] = filter_var($data['hard'], FILTER_VALIDATE_BOOLEAN);
        
        if(!empty($data['id'])) {
            //Get the instance and patch entity
            $rule = $this->Rules->get($data['id']);
            $rule = $this->Rules->patchEntity($rule, $data);
        }
        else {
            $rule = $this->Rules->newEntity($data);
        }
        
        if ($this->Rules->save($rule)) {
            $response = 'Rule saved';
            
            list($rules, $ruleIndexesById) = $this->Rules->getForChoice($choiceId);

            $this->set(compact('rules', 'ruleIndexesById', 'response'));
            $this->set('_serialize', ['rules', 'ruleIndexesById', 'response']);
        } 
        else {
            throw new InternalErrorException(__('Problem with saving choosing settings'));
        }
    }

    /**
     * Delete method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Rules record not found.
     */
    public function delete($choiceId = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Rules->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to delete rules for this Choice.'));
        }
        
        //pr($this->request->data);
        $rule = $this->Rules->get($this->request->data['id'], [
            'contain' => 'ChoosingInstances'
        ]);
        
        if($rule['choosing_instance']['choice_id'] != $choiceId) {
            throw new ForbiddenException(__('Not permitted to delete this rule (Choice IDs do not match).'));
        }
        
        if ($this->Rules->delete($rule)) {
            $response = 'Rule deleted';
            list($rules, $ruleIndexesById) = $this->Rules->getForChoice($choiceId);

            $this->set(compact('rules', 'ruleIndexesById', 'response'));
            $this->set('_serialize', ['rules', 'ruleIndexesById', 'response']);
        } else {
            throw new InternalErrorException(__('Problem with deleting rule'));
        }
    }
}
