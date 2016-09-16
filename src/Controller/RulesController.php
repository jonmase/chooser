<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;
use Cake\Network\Exception\MethodNotAllowedException;

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
     */
    public function get($choiceId) {
        //Make sure the user is an admin for this Choice or the Choice is visible to viewers
        $isAdmin = $this->Rules->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            //TODO: if(Choosing Instance is not available to viewers) {
                throw new ForbiddenException(__('Not permitted to view rules for this Choice.'));
            //}
        }
        
        $rules = $this->Rules->getForChoice($choiceId);

        //TODO: This feels quite ugly/hard work, but is intended to save time repeatedly looping through the array of rules to find the one with the right ID
        $ruleIds = [];
        foreach($rules as $key => $rule) {
            $ruleIds[$rule['id']] = $key;
        }
        
        $ruleCategoryFields = $this->Rules->ExtraFields->getRuleCategoryFields($choiceId);

        $this->set(compact('rules', 'ruleIds', 'ruleCategoryFields'));
        $this->set('_serialize', ['rules', 'ruleIds', 'ruleCategoryFields']);
    }

    /**
     * Index method
     *
     * @return \Cake\Network\Response|null
     */
    /*public function index()
    {
        $this->paginate = [
            'contain' => ['ChoosingInstances', 'ExtraFieldOptions']
        ];
        $rules = $this->paginate($this->Rules);

        $this->set(compact('rules'));
        $this->set('_serialize', ['rules']);
    }*/

    /**
     * View method
     *
     * @param string|null $id Rule id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    /*public function view($id = null)
    {
        $rule = $this->Rules->get($id, [
            'contain' => ['ChoosingInstances', 'ExtraFieldOptions']
        ]);

        $this->set('rule', $rule);
        $this->set('_serialize', ['rule']);
    }*/

    /**
     * Add method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     */
    /*public function add()
    {
        $rule = $this->Rules->newEntity();
        if ($this->request->is('post')) {
            $rule = $this->Rules->patchEntity($rule, $this->request->data);
            if ($this->Rules->save($rule)) {
                $this->Flash->success(__('The rule has been saved.'));

                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The rule could not be saved. Please, try again.'));
            }
        }
        $choosingInstances = $this->Rules->ChoosingInstances->find('list', ['limit' => 200]);
        $extraFieldOptions = $this->Rules->ExtraFieldOptions->find('list', ['limit' => 200]);
        $this->set(compact('rule', 'choosingInstances', 'extraFieldOptions'));
        $this->set('_serialize', ['rule']);
    }*/

    /**
     * Edit method
     *
     * @param string|null $id Rule id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    /*public function edit($id = null)
    {
        $rule = $this->Rules->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $rule = $this->Rules->patchEntity($rule, $this->request->data);
            if ($this->Rules->save($rule)) {
                $this->Flash->success(__('The rule has been saved.'));

                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The rule could not be saved. Please, try again.'));
            }
        }
        $choosingInstances = $this->Rules->ChoosingInstances->find('list', ['limit' => 200]);
        $extraFieldOptions = $this->Rules->ExtraFieldOptions->find('list', ['limit' => 200]);
        $this->set(compact('rule', 'choosingInstances', 'extraFieldOptions'));
        $this->set('_serialize', ['rule']);
    }*/

    /**
     * Delete method
     *
     * @param string|null $id Rule id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    /*public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $rule = $this->Rules->get($id);
        if ($this->Rules->delete($rule)) {
            $this->Flash->success(__('The rule has been deleted.'));
        } else {
            $this->Flash->error(__('The rule could not be deleted. Please, try again.'));
        }

        return $this->redirect(['action' => 'index']);
    }*/
}
