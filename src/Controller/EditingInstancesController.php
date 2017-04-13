<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;

/**
 * EditingInstances Controller
 *
 * @property \App\Model\Table\EditingInstancesTable $EditingInstances
 */
class EditingInstancesController extends AppController
{
    /**
     * getActive method
     *
     * @param string|null $id Choosing Instance id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Network\Exception\ForbiddenException If user is not a Viewer
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function getActive()
    {
        //Make sure the user is an Editor for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        $isEditor = $this->EditingInstances->Choices->ChoicesUsers->isEditor($choiceId, $currentUserId, $tool);
        if(empty($isEditor)) {
            throw new ForbiddenException(__('Not permitted to edit this Choice.'));
        }
        
        $editingInstance = $this->EditingInstances->getActive($choiceId);
        $this->set(compact('editingInstance'));
        $serialize = ['editingInstance'];
    }

    /**
     * View method
     *
     * @param string|null $id Editing Instance id.
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
        $isAdmin = $this->EditingInstances->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to modify editing settings for this Choice.'));
        }
        
        $choice = $this->EditingInstances->Choices->get($choiceId);
        $sections = $this->EditingInstances->Choices->getDashboardSectionsForUser($choiceId, $this->Auth->user('id'));

        $this->set(compact('choice', 'sections'));
    }

}
