<?php
namespace App\Model\Behavior;

use Cake\ORM\Behavior;

class DatetimeBehavior extends Behavior {
    protected $_defaultConfig = [
        'datepickerFormat' => 'D M d Y H:i+',
        'simpleDateFormat' => 'Y-m-d',
        'simpleTimeFormat' => 'H:i',
        'viewDatetimeFormat' => 'H:i \o\n D j M Y',
        'viewDateFormat' => 'D j M Y',
        'viewTimeFormat' => 'H:i',
    ];

    public function createDatetimeForSave($date = null, $time = null) {
        if(!$date) {
            return null;
        }
        
        $config = $this->config();
        $date = $this->formatDateForSave($date);

        if(!$time) {
            $time = '00:00';
        }
        else {
            $time = $this->formatTimeForSave($time);
        }
       
        $datetime = date_create_from_format($config['simpleDateFormat'] . ' ' . $config['simpleTimeFormat'], $date . " " . $time);
        return $datetime;
    }
        
    public function formatDateForSave($date = null) {
        if(!$date) {
            return null;
        }
        
        $config = $this->config(); 
        $date = date_create_from_format($config['datepickerFormat'], $date);
        //pr($date);
        return $date->format($config['simpleDateFormat']);
    }
        
    public function formatTimeForSave($time = null) {
        if(!$time) {
            return null;
        }
        
        $config = $this->config(); 
        $date = date_create_from_format($config['datepickerFormat'], $time);
        return $date->format($config['simpleTimeFormat']);
    }

        
    public function formatForView($date = null, $time = null) {
        if(!$date && !$time) {
            return null;
        }
        
        $value = [];

        $config = $this->config(); 
        if($date && $time) {
            $datetime = date_create_from_format($config['simpleDateFormat'] . ' ' . $config['simpleTimeFormat'], $date . " " . $time);
            $value['formatted'] = $datetime->format($config['viewDatetimeFormat']);
        }
        else if($date) {
            $datetime = date_create_from_format($config['simpleDateFormat'], $date);
            $value['formatted'] = $datetime->format($config['viewDateFormat']);
        }
        else if($time) {
            $datetime = date_create_from_format($config['simpleTimeFormat'], $time);
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