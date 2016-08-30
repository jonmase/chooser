<?php
namespace App\Model\Table;

use App\Model\Entity\Option;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\I18n\Time;

/**
 * Options Model
 *
 * @property \Cake\ORM\Association\hasMany $ChoicesOptions
 * @property \Cake\ORM\Association\hasMany $RulesRelatedOptions (RelatedOptionA)
 * @property \Cake\ORM\Association\hasMany $RulesRelatedOptions (RelatedOptionB)
 */
class OptionsTable extends Table
{
    protected $_optionsTableProperties = ['code', 'title', 'description'];
    protected $_choicesOptionsTableProperties = ['min_places', 'max_places', 'points'];

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->table('options');
        $this->displayField('title');
        $this->primaryKey('id');

        $this->hasMany('ChoicesOptions', [
            'foreignKey' => 'option_id',
        ]);
        $this->hasMany('RelatedOptionA', [
            'className' => 'RulesRelatedOptions',
            'foreignKey' => 'option_a_id',
        ]);
        $this->hasMany('RelatedOptionB', [
            'className' => 'RulesRelatedOptions',
            'foreignKey' => 'option_b_id',
        ]);
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator)
    {
        $validator
            ->integer('id')
            ->allowEmpty('id', 'create');

        $validator
            ->allowEmpty('code');

        $validator
            ->allowEmpty('title');

        $validator
            ->allowEmpty('desc');

        $validator
            ->integer('revision_parent')
            ->requirePresence('revision_parent', 'create')
            ->notEmpty('revision_parent');

        return $validator;
    }
    
    public function getForView($choiceId, $publishedOnly = false, $approvedOnly = false, $userId = null, $editableOnly = false) {
        $conditions = [
            'ChoicesOptions.choice_id' => $choiceId,
            'ChoicesOptions.revision_parent' => 0,
        ];
        if($publishedOnly) {
            $conditions['ChoicesOptions.published'] = 1;
        }
        if($approvedOnly) {
            $conditions['ChoicesOptions.approved'] = 1;
        }
        
        $optionsQuery = $this->ChoicesOptions->find('all', [
            'conditions' => $conditions,
            'contain' => ['Options'],
        ]);
        
        if($userId) {
            $optionsQuery->matching('ChoicesOptionsUsers', function ($q) use ($userId, $editableOnly) {
                $conditions = ['ChoicesOptionsUsers.user_id' => $userId];
                if($editableOnly) {
                    $conditions['ChoicesOptionsUsers.editor'] = true;
                }
                
                return $q->where($conditions);
            });
        }
        
        $options = $optionsQuery->toArray();
        //pr($options); 
        //exit;
        foreach($options as &$option) {
            $option = $this->processForView($option, $choiceId);
        }
        
        return $options;
    }
    
    public function getChoicesOptionsTableProperties() {
        return $this->_choicesOptionsTableProperties;
    }
    public function getOptionsTableProperties() {
        return $this->_optionsTableProperties;
    }
    
    public function processExtrasForSave($choiceId, $extraValues, $extraTypes) {
        foreach($extraTypes as $name => $type) {
            if($type === 'checkbox') {
                foreach($extraValues[$name] as $key => &$bool) {
                    if(filter_var($bool, FILTER_VALIDATE_BOOLEAN)) {
                        $bool = 1;
                    }
                    else {
                        $bool = 0;
                    }
                }
            }
            if($type === 'person') {
                $person = [];
                $personFields = $this->ChoicesOptions->Choices->ExtraFields->getPersonFields();
                foreach($personFields as $personField) {
                    $valueFieldName = $name . '_' . $personField;
                    $person[$personField] = $extraValues[$valueFieldName];
                    unset($extraValues[$valueFieldName]);
                }
                $extraValues[$name] = $person;
            }
            if($type === 'date' || $type === 'datetime') {
                $value = [];
                if(!empty($extraValues[$name . '_date']) && $extraValues[$name . '_date'] !== 'false') {
                    $date = date_create_from_format('D M d Y H:i+', $extraValues[$name . '_date']);
                    //pr($date);
                    $value['date'] = $date->format('Y-m-d');
                    //pr($value);
                }
                unset($extraValues[$name . '_date']);
                
                if($type === 'datetime' && !empty($extraValues[$name . '_time']) && $extraValues[$name . '_time'] !== 'false') {
                    $date = date_create_from_format('D M d Y H:i+', $extraValues[$name . '_time']);
                    $value['time'] = $date->format('H:i');
                    //pr($value);
                    unset($extraValues[$name . '_time']);
                }
                $extraValues[$name] = $value;
            }
        }        
        
        //pr($extraValues);
        //exit;
        $extrasJSON = json_encode($extraValues);
        //pr($extrasJSON);
        //exit;
        return $extrasJSON;
    }

    public function processExtrasForView($extraValuesJSON, $extraTypes) {
        //TODO: Work out how this should be done
        $extraValues = (array) json_decode($extraValuesJSON);
        //pr($extraTypes);
        //pr($extraValues);
        //exit;
        
        foreach($extraTypes as $name => $type) {
            if($type === 'datetime' || $type === 'date') {
                if($type === 'datetime' && !empty($extraValues[$name]->time)) {
                    $datetime = date_create_from_format('Y-m-d H:i', $extraValues[$name]->date . " " . $extraValues[$name]->time);
                    $formattedDateTime = $datetime->format('H:i \o\n D j M Y');
                    $extraValues[$name] = $formattedDateTime;
                }
                else if(!empty($extraValues[$name]->date)) {
                    $date = date_create_from_format('Y-m-d', $extraValues[$name]->date);
                    $formattedDate = $date->format('D j M Y');
                    $extraValues[$name] = $formattedDate;
                }
                else {
                    $extraValues[$name] = null;
                }
            }
        }        
        //pr($extraValues);
        
        return $extraValues;
    }

    public function processForSave($choiceId, $userId, $requestData, $existingChoicesOption = null) {
        //Set up the basic choicesOption data
        //TODO: should we only add bits of this when editing? 
        $choicesOptionData = [
            'choice_id' => $choiceId,
            'published' => 1,  //Publish everything for now. TODO: sort this out
            'published_date' => Time::now(),
            'publisher' => $userId,
            'approved' => 1,  //Approve everything for now. TODO: sort this out
            'allocations_flag' => 0,
            'allocations_hidden' => 0,
            'revision_parent' => 0,
        ];
        if($existingChoicesOption) {
            $choicesOptionData['id'] = $existingChoicesOption['id'];
        }
        
        //Add the choicesOption fields from the form
        foreach($this->_choicesOptionsTableProperties as $property) {
            if(isset($requestData[$property])) {
                $choicesOptionData[$property] = $requestData[$property];
                unset($requestData[$property]);
            }
        }
        
        //Set up the basic option data
        $optionData = ['revision_parent' => 0];
        if($existingChoicesOption) {
            $optionData['id'] = $existingChoicesOption['option']['id'];
        }
        
        //Add the Option fields from the form
        //TODO: Check that an option with this code doesn't already exist for this choice
        foreach($this->_optionsTableProperties as $property) {
            if(isset($requestData[$property])) {
                $optionData[$property] = $requestData[$property];
                unset($requestData[$property]);
            }
        }
        $choicesOptionData['option'] = $optionData;
         //pr($optionData);
       
        if(!$existingChoicesOption) {
            //Set up the choicesOptionsUser record for the editor
            //TODO: Connect up this user (and any others) with extra fields
            $editor = [
                'user_id' => $userId,
                'editor' => 1,
                'visible_to_students' => 0,
            ];
            $choicesOptionData['choices_options_users'] = [$editor];
        }
        
        //Remaining fields are extra fields
        //pr($requestData);
        $extraTypes = $this->ChoicesOptions->Choices->getExtraFieldTypes($choiceId);
        $choicesOptionData['extra'] = $this->processExtrasForSave($choiceId, $requestData, $extraTypes);
        //pr($choicesOptionData);
        //exit;
        
        if($existingChoicesOption) {
            $choicesOption = clone $existingChoicesOption;
            $choicesOption->option = clone $existingChoicesOption->option;
            $choicesOption = $this->ChoicesOptions->patchEntity($choicesOption, $choicesOptionData);
        }
        else {
            $choicesOption = $this->ChoicesOptions->newEntity($choicesOptionData);
        }

        return $choicesOption;
    }
    
    public function processForView($option, $choiceId) {
        foreach($this->_optionsTableProperties as $property) {
            if(isset($option->option[$property])) {
                $option[$property] = $option->option[$property];
            }
        }
        unset($option->option);
       
        //Process the extra fields for displaying
        $extraTypes = $this->ChoicesOptions->Choices->getExtraFieldTypes($choiceId);
        $extras = $this->processExtrasForView($option->extra, $extraTypes);
        foreach($extras as $key => $value) {
            $option[$key] = $value;
        }
        unset($option->extra);
        
        //pr($option);
        return $option;
    }
}
