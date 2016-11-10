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
    public function getActive($choiceId = null, $action = 'view')
    {
        //Make sure the user is an admin for this Choice
        //Not just for admins, needed for viewing choices as well. Can't think of any security issue here that needs admin check
        $isViewer = $this->ChoosingInstances->Choices->ChoicesUsers->isViewer($choiceId, $this->Auth->user('id'));
        if(empty($isViewer)) {
            throw new ForbiddenException(__('Not permitted to view this Choice.'));
        }
        
        $choosingInstance = $this->ChoosingInstances->findActive($choiceId, true, $this->Auth->user('id'));
        //pr($choosingInstance);
        $favourites = [];
        foreach($choosingInstance->shortlisted_options as $option) {
            $favourites[] = $option['choices_option_id'];
        }
        unset($choosingInstance->shortlisted_options);
        
        list($rules, $ruleIndexesById) = $this->ChoosingInstances->Rules->getForInstance($choosingInstance->id);
        
        $serialize = ['choosingInstance', 'favourites', 'rules', 'ruleIndexesById'];
        
        //If getting the instance for settings, get the ruleCategoryFields
        if($action === 'settings') {
            $ruleCategoryFields = $this->ChoosingInstances->Rules->ExtraFields->getRuleCategoryFields($choiceId);
            $this->set(compact('ruleCategoryFields'));
            $serialize = array_merge($serialize, ['ruleCategoryFields']);
        }
        
        //If getting the instance for view, get the selection-related info
        if($action === 'view') {
            //Get all of the selections for this instance and user (should never be more than 2), and will have confirmed first
            $selections = $this->ChoosingInstances->Selections->findByInstanceAndUser($choosingInstance->id, $this->Auth->user('id'));

            //We always want to use the first selection, which will be either confirmed or the most recent unconfirmed one
            $selection = array_shift($selections);
            
            //Archive the remaining selections (should only ever be one)
            $this->ChoosingInstances->Selections->archive($selections);
            
            list($optionsSelected, $optionsSelectedIds, $optionsSelectedIdsPreferenceOrder) = $this->ChoosingInstances->Selections->processSelectedOptions($selection);
            list($allowSubmit, $ruleWarnings) = $this->ChoosingInstances->Rules->checkSelection($optionsSelectedIds, $choosingInstance->id, $choiceId);

            $this->set(compact('selection', 'optionsSelectedIds', 'optionsSelectedIdsPreferenceOrder', 'optionsSelected', 'allowSubmit', 'ruleWarnings'));
            $serialize = array_merge($serialize, ['selection', 'optionsSelectedIds', 'optionsSelectedIdsPreferenceOrder', 'optionsSelected', 'allowSubmit', 'ruleWarnings']);
        }

        $this->set(compact('choosingInstance', 'favourites', 'rules', 'ruleIndexesById'));
        $this->set('_serialize', $serialize);
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
