<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;

/**
 * Options Controller
 *
 * @property \App\Model\Table\OptionsTable $Options
 */
class OptionsController extends AppController
{

    /**
     * Index method
     *
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not Editor
     * @throws \Cake\Datasource\Exception\RecordNotFoundException If Choice is not found.
     */
    public function index($choiceId = null)
    {
        //Make sure the user is an admin for this Choice
        $isEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $this->Auth->user('id'));
        if(!$isEditor) {
            throw new ForbiddenException(__('Not an editor for this Choice.'));
        }
        
        $options = $this->Options->getForView($choiceId, $this->Auth->user('id'));
        //pr($options);

        $choice = $this->Options->ChoicesOptions->Choices->getChoiceWithProcessedExtraFields($choiceId);
        //pr($choice);
        //Get the sections to show in the menu  bar
        $sections = $this->Options->ChoicesOptions->Choices->getDashboardSectionsFromId($choiceId, $this->Auth->user('id'));

        $this->set(compact('choice' , 'options', 'sections'));
        //$this->set('_serialize', ['options']);
    }

    /**
     * save method
     *
     * @param string|null $id Profile id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function save($choiceId = null) {
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isEditor = $this->Options->ChoicesOptions->Choices->ChoicesUsers->isEditor($choiceId, $this->Auth->user('id'));
        if(empty($isEditor)) {
            throw new ForbiddenException(__('Not permitted to create/edit options for this Choice.'));
        }

        if ($this->request->is(['patch', 'post', 'put'])) {
            $choicesOption = $this->Options->processForSave($choiceId, $this->Auth->user('id'), $this->request->data);
            //pr($choicesOption);
            //exit;
            //pr($choicesOption);
            //exit;
       
            if($this->Options->ChoicesOptions->save($choicesOption)) {
                $this->set('response', 'Option saved');
                
                $option = $this->Options->processForView($choicesOption);
                $this->set('option', $option);
            } 
            else {
                throw new InternalErrorException(__('Problem with saving option'));
            }
        }
        else {
            throw new MethodNotAllowedException(__('Saving option requires POST'));
        }
    }

    /**
     * Add method
     *
     * @return \Cake\Network\Response|void Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $option = $this->Options->newEntity();
        if ($this->request->is('post')) {
            $option = $this->Options->patchEntity($option, $this->request->data);
            if ($this->Options->save($option)) {
                $this->Flash->success(__('The option has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The option could not be saved. Please, try again.'));
            }
        }
        $this->set(compact('option'));
        $this->set('_serialize', ['option']);
    }

    /**
     * Edit method
     *
     * @param string|null $id Option id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $option = $this->Options->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $option = $this->Options->patchEntity($option, $this->request->data);
            if ($this->Options->save($option)) {
                $this->Flash->success(__('The option has been saved.'));
                return $this->redirect(['action' => 'index']);
            } else {
                $this->Flash->error(__('The option could not be saved. Please, try again.'));
            }
        }
        $this->set(compact('option'));
        $this->set('_serialize', ['option']);
    }

    /**
     * Delete method
     *
     * @param string|null $id Option id.
     * @return \Cake\Network\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $option = $this->Options->get($id);
        if ($this->Options->delete($option)) {
            $this->Flash->success(__('The option has been deleted.'));
        } else {
            $this->Flash->error(__('The option could not be deleted. Please, try again.'));
        }
        return $this->redirect(['action' => 'index']);
    }
}
