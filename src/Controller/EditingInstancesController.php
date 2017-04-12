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
