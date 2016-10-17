<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;

/**
 * ChoosingInstances Controller
 *
 * @property \App\Model\Table\ChoosingInstancesTable $ChoosingInstances
 */
class ChoosingInstancesController extends AppController
{

    /**
     * Archive method
     * Displays the archive of previous choosing instances
     *
     * @return \Cake\Network\Response|null
     */
    /*public function archive()
    {
        $this->paginate = [
            'contain' => ['Choices']
        ];
        $choosingInstances = $this->paginate($this->ChoosingInstances);

        $this->set(compact('choosingInstances'));
        $this->set('_serialize', ['choosingInstances']);
    }*/

    /**
     * View method
     *
     * @param string|null $id Choosing Instance id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($choiceId = null)
    {
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        //$choosingInstance = $this->ChoosingInstances->findActive($choiceId);
        //pr($choosingInstance);
        
        /*$ruleModels = ['rules', 'rules_related_options', 'rules_related_categories'];
        $rules = [];
        foreach($ruleModels as $model) {
            $rules[$model] = $choosingInstance[$model];
            unset($choosingInstance[$model]);
        }
        pr($rules);*/
        
        /*$ruleCategoryFields = $this->ChoosingInstances->Choices->ExtraFields->getRuleCategoryFields($choiceId);
        pr($ruleCategoryFields);*/
        
        $choice = $this->ChoosingInstances->Choices->get($choiceId);
        $sections = $this->ChoosingInstances->Choices->getDashboardSectionsFromId($choiceId, $this->Auth->user('id'));
        //pr($choice);

        $this->set(compact('choice', 'sections'));
        //$this->set(compact('choosingInstance', 'rules', 'ruleCategoryFields', 'choice', 'sections'));
        //$this->set('_serialize', ['choosingInstance']);
    }
    
    /**
     * GetInstance method
     *
     * @param string|null $id Choosing Instance id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not a Viewer
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function getActive($choiceId = null)
    {
        //Make sure the user is an admin for this Choice
        //Not just for admins, needed for viewing choices as well. Can't think of any security issue here that needs admin check
        $isViewer = $this->ChoosingInstances->Choices->ChoicesUsers->isViewer($choiceId, $this->Auth->user('id'));
        if(empty($isViewer)) {
            throw new ForbiddenException(__('Not permitted to view this Choice.'));
        }
        
        $choosingInstance = $this->ChoosingInstances->findActive($choiceId, true, $this->Auth->user('id'));
        
        $favourites = [];
        foreach($choosingInstance->shortlisted_options as $option) {
            $favourites[] = $option['choices_option_id'];
        }
        unset($choosingInstance->shortlisted_options);
        
        $this->set(compact('choosingInstance', 'favourites'));
        $this->set('_serialize', ['choosingInstance', 'favourites']);
    }
    
    

    /**
     * Save method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\InternalErrorException When save fails.
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When instance record not found.
     */
    public function save($choiceId = null)
    {
        $this->request->allowMethod(['post']);

        //Make sure the user is an admin for this Choice
        $isAdmin = $this->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        //pr($this->request->data);
        //exit;
        
        $this->viewBuilder()->layout('ajax');
        
        //Process the data
        $data = $this->ChoosingInstances->processForSave($this->request->data);
        $data['active'] = true;
        $data['choice_id'] = $choiceId;
        
        //pr($data);
        //exit;
        
        if(!empty($data['instance_id'])) {
            //Get the instance and patch entity
            $choosingInstance = $this->ChoosingInstances->get($data['instance_id']);
            $choosingInstance = $this->ChoosingInstances->patchEntity($choosingInstance, $data);
        }
        else {
            $choosingInstance = $this->ChoosingInstances->newEntity($data);
        }
        
        ////pr($choosingInstance);
        //exit;
        
        if ($this->ChoosingInstances->save($choosingInstance)) {
            $this->set('response', 'Choosing settings saved');
            //pr($choosingInstance);
            //exit;
            $instanceForView = $this->ChoosingInstances->processForView($choosingInstance);
            //pr($instanceForView);
            //exit;
            $this->set('instance', $instanceForView);
        } 
        else {
            throw new InternalErrorException(__('Problem with saving choosing settings'));
        }
    }

    /**
     * Edit method
     *
     * @param string|null $id Choosing Instance id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    /*public function edit($id = null)
    {
        $choosingInstance = $this->ChoosingInstances->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $choosingInstance = $this->ChoosingInstances->patchEntity($choosingInstance, $this->request->data);
            if ($this->ChoosingInstances->save($choosingInstance)) {
                $this->Flash->success(__('The choosing instance has been saved.'));

                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The choosing instance could not be saved. Please, try again.'));
            }
        }
        $choices = $this->ChoosingInstances->Choices->find('list', ['limit' => 200]);
        $this->set(compact('choosingInstance', 'choices'));
        $this->set('_serialize', ['choosingInstance']);
    }*/

    /**
     * Delete method
     *
     * @param string|null $id Choosing Instance id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    /*public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $choosingInstance = $this->ChoosingInstances->get($id);
        if ($this->ChoosingInstances->delete($choosingInstance)) {
            $this->Flash->success(__('The choosing instance has been deleted.'));
        } else {
            $this->Flash->error(__('The choosing instance could not be deleted. Please, try again.'));
        }

        return $this->redirect(['action' => 'index']);
    }*/
}
