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
        'db_timezone' => 'UTC',
        'view_timezone' => 'Europe/London',
    ];
    
    public function unsetCreatedModified($entity = []) {
        //unset($entity->created);
        //unset($entity->modified);
        //Use array notation so works for arrays and entities
        unset($entity['created']);
        unset($entity['modified']);
        
        return $entity;
    }
    
    public function unsetCreatedModifiedMultiple($entities = []) {
        if(!empty($entities)) {
            foreach($entities as &$entity) {
                $entity = $this->unsetCreatedModified($entity);
            }
        }
        return $entities;
    }
    
    public function createFromFormat($format = null, $value = null) {
        if(!$format || !$value) {
            return null;
        }
        
        $config = $this->config();
        
        $datetime = Time::createFromFormat(
            $format,
            $value,
            $config['view_timezone']
        );
        
        return $datetime;
    }

    public function formatTimeObject($timeObject = null, $format = null) {
        if(!$timeObject || !$format) {
            return null;
        }
        
        $config = $this->config();
        
        $formatted = $timeObject->i18nFormat($format, $config['view_timezone']);
       
        return $formatted;
    }

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
       
        $datetime = $date . " " . $time;
        $format = $config['createSimpleDateFormat'] . ' ' . $config['createSimpleTimeFormat'];
        
        
        $datetimeObject = $this->createFromFormat(
            $format,
            $datetime
        );
        
        //Change the timezone of the datetime object to the db timezone
        $datetimeObject->timezone = $config['db_timezone'];
        
        return $datetimeObject;
    }
        
    public function formatDateForSave($date = null) {
        if(!$date) {
            return null;
        }
        
        $config = $this->config(); 
        $timeObject = $this->createFromFormat(
            $config['datepickerFormat'],
            $date
        );
        
        $date = $this->formatTimeObject($timeObject, $config['formatSimpleDateFormat']);

        return $date;
    }
        
    public function formatTimeForSave($time = null) {
        if(!$time) {
            return null;
        }
        
        $config = $this->config(); 
        
        $timeObject = $this->createFromFormat(
            $config['datepickerFormat'],
            $time
        );
        
        $time = $this->formatTimeObject($timeObject, $config['formatSimpleTimeFormat']);
        
        return $time;
    }

    public function formatDatetimeForView($timeObject = null, $date = true, $time = true) {
        if(!$timeObject) {
            return null;
        }
        
        $value = [];

        $config = $this->config(); 
        if($date && $time) {
            $value['formatted'] = $this->formatTimeObject($timeObject, $config['viewDatetimeFormat']);
            $value['timestamp'] = $timeObject->getTimestamp();
        }
        else if($date) {
            $value['formatted'] = $this->formatTimeObject($timeObject, $config['viewDateFormat']);
        }
        else if($time) {
            $value['formatted'] = $this->formatTimeObject($timeObject, $config['viewTimeFormat']);
        }
        
        if($date) {
            $value['date'] = [
                'year' => $this->formatTimeObject($timeObject, $config['yearFormat']),
                'month' => $this->formatTimeObject($timeObject, $config['monthFormat']),
                'day' => $this->formatTimeObject($timeObject, $config['dayFormat']),
            ];
        }
        
        if($time) {
            $midnightText = '12:00 AM';
            $value['formatted'] = str_replace($midnightText, 'Midnight', $value['formatted']);
            
            $value['time'] = [
                'hour' => $this->formatTimeObject($timeObject, $config['hourFormat']),
                'minute' => $this->formatTimeObject($timeObject, $config['minFormat']),
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
            $datetime = $this->createFromFormat(
                $config['createSimpleDateFormat'] . ' ' . $config['createSimpleTimeFormat'],
                $date . " " . $time
            );
        }
        else if($date) {
            $datetime = $this->createFromFormat($config['createSimpleDateFormat'], $date);
        }
        else if($time) {
            $datetime = $this->createFromFormat($config['createSimpleTimeFormat'], $time);
        }
        
        $value = $this->formatDatetimeForView($datetime, $date, $time);

        return $value;
    }
}