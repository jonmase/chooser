<?php
namespace App\Model\Behavior;

use Cake\ORM\Behavior;

class DatetimeBehavior extends Behavior {
    protected $_defaultConfig = [
        'datepickerFormat' => 'D M d Y H:i+',
        'dbDateFormat' => 'Y-m-d',
        'dbTimeFormat' => 'H:i',
        'viewDatetimeFormat' => 'H:i \o\n D j M Y',
        'viewDateFormat' => 'D j M Y',
        'viewTimeFormat' => 'H:i',
    ];

    public function formatDateForSave($date = null) {
        if(!$date) {
            return null;
        }
        
        $config = $this->config(); 
        $date = date_create_from_format($config['datepickerFormat'], $date);
        //pr($date);
        return $date->format($config['dbDateFormat']);
    }
        
    public function formatTimeForSave($time = null) {
        if(!$time) {
            return null;
        }
        
        $config = $this->config(); 
        $date = date_create_from_format($config['datepickerFormat'], $time);
        return $date->format($config['dbTimeFormat']);
    }

        
    public function formatForView($date = null, $time = null) {
        if(!$date && !$time) {
            return null;
        }
        
        $value = [];

        $config = $this->config(); 
        if($date && $time) {
            $datetime = date_create_from_format($config['dbDateFormat'] . ' ' . $config['dbTimeFormat'], $date . " " . $time);
            $value['formatted'] = $datetime->format($config['viewDatetimeFormat']);
        }
        else if($date) {
            $datetime = date_create_from_format($config['dbDateFormat'], $date);
            $value['formatted'] = $datetime->format($config['viewDateFormat']);
        }
        else if($time) {
            $datetime = date_create_from_format($config['dbTimeFormat'], $time);
            $value['formatted'] = $datetime->format($config['viewTimeFormat']);
        }
        
        if($date) {
            $value['date'] = [
                'year' => $datetime->format('Y'),
                'month' => $datetime->format('m'),
                'day' => $datetime->format('d'),
            ];
        }
        
        if($time) {
            $value['time'] = [
                'hour' => $datetime->format('H'),
                'minute' => $datetime->format('i'),
            ];
        }
        
        return $value;
    }
}