<?php
namespace App\Controller\Component;

use Cake\Controller\Component;
use Cake\ORM\TableRegistry;

class RedirectionComponent extends Component
{
    public $components = ['Auth'];
    
    public function goToDashboardOrView($choiceId = null, $tool = null) {
        if(!$choiceId || !$tool) {
            $this->loadComponent('SessionData');
            
            if(!$choiceId) {
                $choiceId = $this->SessionData->getChoiceId();
            }
            
            if(!$tool) {
                $tool = $this->SessionData->getLtiTool();
            }
        }
        
        $Controller = $this->_registry->getController();
        //Redirect users with more than view role to Choice dashboard page
        $ChoicesUsers = TableRegistry::get('ChoicesUsers');
        if($ChoicesUsers->isMoreThanViewer($choiceId, $this->Auth->user('id'), $tool)) {
            $Controller->redirect(['controller' => 'choices', 'action' => 'dashboard']);
        }
        //Redirect users with view role to Choice view page
        else {
            $Controller->redirect(['controller' => 'options', 'action' => 'view']);
        }
    }
}