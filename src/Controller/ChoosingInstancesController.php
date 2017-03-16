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
    public function view()
    {
        //Make sure the user is an admin for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        $isAdmin = $this->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        $choice = $this->ChoosingInstances->Choices->get($choiceId);
        $sections = $this->ChoosingInstances->Choices->getDashboardSectionsForUser($choiceId, $this->Auth->user('id'));
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
    public function getActive($action = 'view')
    {
        //Make sure the user is an admin for this Choice
        //Not just for admins, needed for viewing choices as well. Can't think of any security issue here that needs admin check
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        $isViewer = $this->ChoosingInstances->Choices->ChoicesUsers->isViewer($choiceId, $currentUserId, $tool);
        if(empty($isViewer)) {
            throw new ForbiddenException(__('Not permitted to view this Choice.'));
        }
        
        $choosingInstance = $this->ChoosingInstances->findActive($choiceId, true, $this->Auth->user('id'));
        //pr($choosingInstance);
        $this->set(compact('choosingInstance'));
        $serialize = ['choosingInstance'];
        
        if(!empty($choosingInstance)) {
            $shortlistedOptions = $choosingInstance->shortlisted_options;
            unset($choosingInstance->shortlisted_options);
            
            list($rules, $ruleIndexesById) = $this->ChoosingInstances->Rules->getForInstance($choosingInstance->id);
            
            $this->set(compact('choosingInstance', 'rules'));
            $serialize = array_merge($serialize, ['choosingInstance', 'rules']);
            
            //If getting the instance for settings, get the ruleCategoryFields
            if($action === 'settings') {
                $ruleCategoryFields = $this->ChoosingInstances->Rules->ExtraFields->getRuleCategoryFields($choiceId);
                $this->set(compact('ruleCategoryFields'));
                $serialize = array_merge($serialize, ['ruleCategoryFields']);
            }
            
            //If getting the instance for view, get the selection-related info
            if($action === 'view') {
                //Get the user's favourites
                $favourites = [];
                foreach($shortlistedOptions as $option) {
                    $favourites[] = $option['choices_option_id'];
                }
                
                //Get all of the selections for this instance and user (should never be more than 2), and will have confirmed first
                $selections = $this->ChoosingInstances->Selections->findByInstanceAndUser($choosingInstance->id, $this->Auth->user('id'));
                
                if(!empty($selections)) {
                    //We always want to use the first selection, which will be either confirmed or the most recent unconfirmed one
                    $selection = array_shift($selections);
                    
                    //Archive the remaining selections (should only ever be one)
                    $this->ChoosingInstances->Selections->archive($selections);
                }
                else {
                    $selection = [];
                }
                
                list($optionsSelected, $optionsSelectedIds, $optionsSelectedIdsPreferenceOrder) = $this->ChoosingInstances->Selections->processSelectedOptions($selection);
                list($allowSubmit, $ruleWarnings) = $this->ChoosingInstances->Rules->checkSelection($optionsSelectedIds, $choosingInstance->id, $choiceId);

                $this->set(compact('allowSubmit', 'favourites', 'optionsSelectedIds', 'optionsSelectedIdsPreferenceOrder', 'optionsSelected', 'ruleIndexesById', 'ruleWarnings', 'selection'));
                $serialize = array_merge($serialize, ['allowSubmit', 'favourites', 'optionsSelectedIds', 'optionsSelectedIdsPreferenceOrder', 'optionsSelected', 'ruleIndexesById', 'ruleWarnings', 'selection']);
            }
        }

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
    public function save()
    {
        $this->request->allowMethod(['post']);
        $this->viewBuilder()->layout('ajax');

        //Make sure the user is an admin for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        $isAdmin = $this->ChoosingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }
        
        
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
