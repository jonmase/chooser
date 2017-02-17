<?php
namespace App\Controller\Component;

use Cake\Controller\Component;

class SessionDataComponent extends Component
{
    public function getChoiceId() {
        $choiceId = $this->request->session()->read('choiceId');
        
        return $choiceId;
    }
    
    public function getLtiTool() {
        $tool = $this->request->session()->read('tool');
        
        return $tool;
    }
}