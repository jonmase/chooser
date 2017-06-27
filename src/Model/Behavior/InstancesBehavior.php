<?php
namespace App\Model\Behavior;

use Cake\ORM\Behavior;
use Cake\I18n\Time;

class InstancesBehavior extends Behavior {
    public function processInstanceForSave($requestData = null, $datetimeFields = [], $boolFields = []) {
        if(!$requestData) {
            return [];
        }
        
        foreach($datetimeFields as $field) {
            if(!empty($requestData[$field . '_date'])) {
                if(!empty($requestData[$field . '_time'])) {
                    $requestData[$field] = $this->_table->createDatetimeForSave($requestData[$field . '_date'], $requestData[$field . '_time']);
                }
                else {
                    $requestData[$field] = $this->_table->createDatetimeForSave($requestData[$field . '_date']);
                }
            }
            unset($requestData[$field . '_date'], $requestData[$field . '_time']);
        }
        
        foreach($boolFields as $field) {
            if(!empty($requestData[$field])) {  //If field is not empty, convert it to bool
                $requestData[$field] = filter_var($requestData[$field], FILTER_VALIDATE_BOOLEAN);
            }
            else {  //Empty fields are always false
                $requestData[$field] = false;
            }
        }

        return $requestData;
    }
    
    public function processInstanceForView($instance = null, $datetimeFields = []) {
        if(!$instance) {
            return [];
        }
        
        $time = Time::now();
        foreach($datetimeFields as $field) {
            $datetimeField = [];
            if(!empty($instance[$field])) {
                $date = $instance[$field];
                
                $instance[$field] = $this->_table->formatDatetimeObjectForView($date);
                
                //Check whether date has passed
                if($date <= $time) {
                    $instance[$field]['passed'] = true;
                }
                else {
                    $instance[$field]['passed'] = false;
                }
            }
            //If field is empty...
            else {
                //If it is the opens field, set passed to true, so it will be open
                //If it is the extension field, set passed to true, as this means there is no extension
                if($field === 'opens' || $field === 'extension') {
                    $instance[$field] = ['passed' => true];
                }
                //Otherwise (deadline), set to false, so it won't have closed
                else {
                    $instance[$field] = ['passed' => false];
                }
            }
        }
        
        //Work out if the instance is open
        if($instance['opens']['passed'] && (!$instance['deadline']['passed'] || $instance['extension']['passed'])) {
            $instance['open'] = true;
        }
        
        return $instance;
    }

    public function copyInstanceWithoutDates($instanceArray = null, $datetimeFields = []) {
        if(!$instanceArray) {
            return null;
        }
        
        unset($instanceArray['id']);    //unset the id
        
        $instanceArray = $this->_table->unsetCreatedModified($instanceArray);   //unset created/modified dates, so these are generated automatically
        
        //Set datetime fields to null
        foreach($datetimeFields as $datetimeField) {
            $instanceArray[$datetimeField] = null;
        }
        
        $instance = $this->_table->newEntity($instanceArray);   //hydrate
        
        return $instance;
    }
}