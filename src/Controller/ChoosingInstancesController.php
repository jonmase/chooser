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
        
        $choice = $this->ChoosingInstances->Choices->get($choiceId);
        $sections = $this->ChoosingInstances->Choices->getDashboardSectionsFromId($choiceId, $this->Auth->user('id'));
        //pr($choice);

        $this->set(compact('choice', 'sections'));
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
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
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
        
        $this->viewBuilder()->layout('ajax');
        
        //Process the data
        $data = $this->ChoosingInstances->processForSave($this->request->data);
        $data['active'] = true;
        $data['choice_id'] = $choiceId;
        
        if(!empty($data['instance_id'])) {
            //Get the instance and patch entity
            $choosingInstance = $this->ChoosingInstances->get($data['instance_id']);
            $choosingInstance = $this->ChoosingInstances->patchEntity($choosingInstance, $data);
        }
        else {
            $choosingInstance = $this->ChoosingInstances->newEntity($data);
        }
        
        if ($this->ChoosingInstances->save($choosingInstance)) {
            $this->set('response', 'Choosing settings saved');
            $instanceForView = $this->ChoosingInstances->processForView($choosingInstance);
            $this->set('instance', $instanceForView);
        } 
        else {
            throw new InternalErrorException(__('Problem with saving choosing settings'));
        }
    }
}
