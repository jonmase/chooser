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
        
        list($rules, $ruleIndexesById) = $this->Rules->getForChoice($choiceId);
        
        $ruleCategoryFields = $this->Rules->ExtraFields->getRuleCategoryFields($choiceId);

        $this->set(compact('rules', 'ruleIndexesById', 'ruleCategoryFields'));
        $this->set('_serialize', ['rules', 'ruleIndexesById', 'ruleCategoryFields']);
    }

    /**
     * Save method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     */
    public function save($choiceId = null)
    {
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Rules->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        if ($this->request->is('post')) {
            //pr($this->request->data);
            //exit;
            
            //Process the data
            /*$data = $this->ChoosingInstances->processForSave($this->request->data);
            
            //pr($data);
            //exit;
            */
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
            
            //pr($rule);
            //exit;
            
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
        else {
            throw new MethodNotAllowedException(__('Saving choosing settings requires POST'));
        }
    }

    /**
     * Delete method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     */
    public function delete($choiceId = null)
    {
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->Rules->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to delete rules for this Choice.'));
        }
        
        $this->request->allowMethod(['post', 'delete']);
        
        //pr($this->request->data);
        $rule = $this->Rules->get($this->request->data['id'], [
            'contain' => 'ChoosingInstances'
        ]);
        
        if($rule['choosing_instance']['choice_id'] != $choiceId) {
            throw new ForbiddenException(__('Not permitted to delete this rule (Choice IDs do not match).'));
        }
        
        //pr($rule);
        //exit;
        
        if ($this->Rules->delete($rule)) {
            $response = 'Rule deleted';
            list($rules, $ruleIndexesById) = $this->Rules->getForChoice($choiceId);

            $this->set(compact('rules', 'ruleIndexesById', 'response'));
            $this->set('_serialize', ['rules', 'ruleIndexesById', 'response']);
        } else {
            throw new InternalErrorException(__('Problem with deleting rule'));
        }
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
