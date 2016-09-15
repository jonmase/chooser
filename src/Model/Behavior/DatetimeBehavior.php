<?php
namespace App\Model\Behavior;

use Cake\ORM\Behavior;
use Cake\I18n\Time;

class DatetimeBehavior extends Behavior {
    protected $_yearFormat = 'yyyy';
    
    protected $_defaultConfig = [
        'datepickerFormat' => 'D M d Y H:i+',
        'createSimpleDateFormat' => 'Y-m-d',
        'createSimpleTimeFormat' => 'H:i',
        'formatSimpleDateFormat' => 'yyyy-MM-dd',
        'formatSimpleTimeFormat' => 'HH:mm',
        //'viewDatetimeFormat' => 'H:i \o\n D j M Y',
        //'viewDateFormat' => 'D j M Y',
        //'viewTimeFormat' => 'H:i',
        'viewDatetimeFormat' => "h:mm a 'on' EEE d MMM yyyy",
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
       
        //pr($time);
        //pr($date);
        //exit;
        $datetime = $date . " " . $time;
        $format = $config['createSimpleDateFormat'] . ' ' . $config['createSimpleTimeFormat'];
        //pr($datetime);
        //pr($format);
        //exit;
        $datetimeObject = Time::createFromFormat(
            $format,
            $datetime,
            'Europe/London'
        );
        //pr($datetimeObject);
        //exit;
        return $datetimeObject;
    }
        
    public function formatDateForSave($date = null) {
        if(!$date) {
            return null;
        }
        //pr($date);
        $config = $this->config(); 
       // $date = date_create_from_format($config['datepickerFormat'], $date);
        $timeObject = Time::createFromFormat(
            $config['datepickerFormat'],
            $date
        );
        //pr($timeObject);
        
        $date = $timeObject->i18nFormat($config['formatSimpleDateFormat']);
        //pr($date);
        //exit;
        //return $date->format($config['simpleDateFormat']);
        return $date;
    }
        
    public function formatTimeForSave($time = null) {
        if(!$time) {
            return null;
        }
        //pr($time);
        
        $config = $this->config(); 
        //$date = date_create_from_format($config['datepickerFormat'], $time);
        $timeObject = Time::createFromFormat(
            $config['datepickerFormat'],
            $time
        );
        //pr($timeObject);
        
        //return $date->format($config['simpleTimeFormat']);
        $time = $timeObject->i18nFormat($config['formatSimpleTimeFormat']);
        //pr($time);
        //exit;
        return $time;
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
            $midnightText = '12:00 AM';
            $value['formatted'] = str_replace($midnightText, 'Midnight', $value['formatted']);
            
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