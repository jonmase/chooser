<?php
namespace App\Model\Behavior;

use Cake\ORM\Behavior;
use Cake\I18n\Time;

class DatetimeBehavior extends Behavior {
    protected $_yearFormat = 'yyyy';
    
    protected $_defaultConfig = [
        'datepickerFormat' => 'D M d Y H:i+',
        'simpleDateFormat' => 'Y-m-d',
        'simpleTimeFormat' => 'H:i',
        //'viewDatetimeFormat' => 'H:i \o\n D j M Y',
        //'viewDateFormat' => 'D j M Y',
        //'viewTimeFormat' => 'H:i',
        'viewDatetimeFormat' => "HH:mm 'on' EEE d MMM yyyy",
        'viewDateFormat' => "EEE d MMM yyyy",
        'viewTimeFormat' => "HH:mm",
        'yearFormat' => "yyyy",
        'monthFormat' => "MM",
        'dayFormat' => "dd",
        'hourFormat' => "HH",
        'minFormat' => "mm",
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

    public function formatDatetimeForView($timeObject = null, $date = true, $time = true) {
        if(!$timeObject) {
            return null;
        }
        
        $value = [];

        $config = $this->config(); 
        if($date && $time) {
            $value['formatted'] = $timeObject->i18nFormat($config['viewDatetimeFormat']);
        }
        else if($date) {
            $value['formatted'] = $timeObject->i18nFormat($config['viewDateFormat']);
        }
        else if($time) {
            $value['formatted'] = $timeObject->i18nFormat($config['viewTimeFormat']);
        }
        
        if($date) {
            $value['date'] = [
                'year' => $timeObject->i18nFormat($config['yearFormat']),
                'month' => $timeObject->i18nFormat($config['monthFormat']),
                'day' => $timeObject->i18nFormat($config['dayFormat']),
            ];
        }
        
        if($time) {
            if(substr($value['formatted'], 0, 5) === '00:00') {
                $value['formatted'] = str_replace('00:00', 'Midnight', $value['formatted']);
            }
            
            $value['time'] = [
                'hour' => $timeObject->i18nFormat($config['hourFormat']),
                'minute' => $timeObject->i18nFormat($config['minFormat']),
            ];
        }
        
        return $value;
    }

    public function formatDatetimeObjectForView($datetime = null) {
        if(!$datetime) {
            return null;
        }
        
        $value = $this->formatDatetimeForView($datetime, true, true);
        
        return $value;
    }
        
    public function formatSimpleDatetimeForView($date = null, $time = null) {
        if(!$date && !$time) {
            return null;
        }
        
        $value = [];

        $config = $this->config(); 
        if($date && $time) {
            //$datetime = date_create_from_format($config['simpleDateFormat'] . ' ' . $config['simpleTimeFormat'], $date . " " . $time);
            $datetime = Time::createFromFormat(
                $config['simpleDateFormat'] . ' ' . $config['simpleTimeFormat'],
                $date . " " . $time
            );
            //$value['formatted'] = $datetime->format($config['viewDatetimeFormat']);
        }
        else if($date) {
            $datetime = Time::createFromFormat($config['simpleDateFormat'], $date);
            //$value['formatted'] = $datetime->format($config['viewDateFormat']);
        }
        else if($time) {
            $datetime = Time::createFromFormat($config['simpleTimeFormat'], $time);
            //$value['formatted'] = $datetime->format($config['viewTimeFormat']);
        }
        
        /*if($date) {
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
        }*/
        
        $value = $this->formatDatetimeForView($datetime, $date, $time);

        return $value;
    }
}