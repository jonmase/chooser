<?php
namespace App\Controller\Component;

use Cake\Controller\Component;

class LTIToolProviderComponent extends Component
{
    public static function onLaunch($tool_provider = null) {
        $tool_provider->ltilaunch = true;
    }
}