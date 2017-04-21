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
    //Sort by code then title - further sorting will be done on frontend
    protected $_sortOrderCode = ['Options.code' => 'ASC', 'Options.title' => 'ASC'];
    protected $_sortOrderTitle = ['Options.title' => 'ASC'];
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
        
        $this->addBehavior('Datetime');

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
    
    public function getSortOrder($choiceId) {
        //return $this->_sortOrder;
        $choice = $this->ChoicesOptions->Choices->get($choiceId, ['fields' => ['id', 'use_code']]);
        
        if($choice->use_code) {
            return $this->_sortOrderCode;
        }
        else {
            return $this->_sortOrderTitle;
        }
    }
    
    //public function getOptions($choiceId, $publishedOnly = false, $approvedOnly = false, $editableOnly = false, $userId = null) {
    //public function getOptions($choiceId = null, $viewable = true, $editable = false, $approvable = false, $userId = null) {
    public function getOptions($choiceId = null, $conditions = []) {
        //If no choice ID, or all types are specified as false, return empty array
        if(!$choiceId) {
            return [];
        }
        
        //Add basic conditions - options for this choice that aren't revisions
        $conditions['ChoicesOptions.choice_id'] = $choiceId;
        $conditions['ChoicesOptions.revision_parent'] = 0;
        
        //pr($conditions); exit;
        
        $optionsQuery = $this->ChoicesOptions->find('all', [
            'conditions' => $conditions,
            'contain' => ['Options'],
            'order' => $this->getSortOrder($choiceId),
        ]);
        
        $options = $optionsQuery->toArray();
        
        $extraTypes = $this->ChoicesOptions->Choices->getExtraFieldTypes($choiceId);
        foreach($options as &$option) {
            $option = $this->processForView($option, $extraTypes);
        }
        
        return $options;
    }
    
    public function getOptionsConditionsForEditor($choiceId = null, $userId = null) {
        if(!$choiceId || !$userId) {
            return false;
        }
        
        //Only let them see options they are editors of
        $optionsQuery = $this->ChoicesOptions->find('list', [
            'conditions' => ['ChoicesOptions.choice_id' => $choiceId],
            'keyField' => 'id',
            'valueField' => 'id',
        ]);
        
        $optionsQuery->matching('ChoicesOptionsUsers', function ($q) use ($userId) {
            $conditions = [
                'ChoicesOptionsUsers.user_id' => $userId,
                'ChoicesOptionsUsers.editor' => true,
            ];
            
            return $q->where($conditions);
        });
        
        $optionsIds = $optionsQuery->toArray();
        
        $optionConditions = [
            'ChoicesOptions.id IN' => $optionsIds,
        ];
        
        return $optionConditions;
    }
    
    public function getOptionsForEdit($choiceId = null, $currentUserId = null, $isAdmin = false, $isApprover = false, $isEditor = false) {
        if(!$choiceId || (!$isAdmin && !$isApprover && !$isEditor)) {
            return [];
        }
        
        //Admins can always view all of the options
        if($isAdmin) {
            $conditions = [];
        }
        //Get the appropriate conditions for the user's roles
        else {
            $conditions['OR'] = [];
            if($isApprover) {
                //Approvable options must be published and not deleted
                $conditions['OR'][] = [
                    'ChoicesOptions.published' => 1,
                    'ChoicesOptions.deleted' => 0,
                ];
            }
            if($isEditor) {
                if($editorConditions = $this->getOptionsConditionsForEditor($choiceId, $currentUserId)) {
                    $conditions['OR'][] = $editorConditions;
                }
            }
        }
            
        $options = $this->getOptions($choiceId, $conditions);
        
        return $options;
    }
    
    public function getOptionsForView($choiceId = null) {
        if(!$choiceId) {
            return [];
        }
        
        //Viewable options must be published and approved, and not deleted
        $conditions = [
            'ChoicesOptions.published' => 1,
            'ChoicesOptions.approved' => 1,
            'ChoicesOptions.deleted' => 0,
        ];
        
        $options = $this->getOptions($choiceId, $conditions);
        
        return $options;
    }
        
    public function getChoicesOptionsTableProperties() {
        return $this->_choicesOptionsTableProperties;
    }

    public function getOptionsTableProperties() {
        return $this->_optionsTableProperties;
    }
    
    //Create an array of optionIds mapped to index in options array
    //TODO: This feels quite ugly/hard work, but is intended to save time repeatedly looping through the array of options to find the one with the right ID
    public function getOptionIndexesById($options = null) {
        if(empty($options)) {
            return [];
        }
        
        $optionIndexesById = [];
        foreach($options as $key => $option) {
            $optionIndexesById[$option['id']] = $key;
        }
        return $optionIndexesById;
    }
    
    public function processExtrasForSave($choiceId, $extraValues, $extraTypes) {
        foreach($extraTypes as $name => $type) {
            if($type === 'checkbox' && !empty($extraValues[$name])) {
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
                    $value['date'] = $this->formatDateForSave($extraValues[$name . '_date']);
                }
                unset($extraValues[$name . '_date']);
                
                if($type === 'datetime' && !empty($extraValues[$name . '_time']) && $extraValues[$name . '_time'] !== 'false') {
                    $value['time'] = $this->formatTimeForSave($extraValues[$name . '_time']);
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
                $value = [];
                if($type === 'datetime' && !empty($extraValues[$name]->time)) {
                    $extraValues[$name] = $this->formatSimpleDatetimeForView($extraValues[$name]->date, $extraValues[$name]->time);
                }
                else if(!empty($extraValues[$name]->date)) {
                    $extraValues[$name] = $this->formatSimpleDatetimeForView($extraValues[$name]->date);
                }
                else {
                    $extraValues[$name] = null;
                }
            }
            else if($type === 'checkbox') {
                if(!empty($extraValues[$name])) {
                    $extraValues[$name] = get_object_vars($extraValues[$name]);
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
    
    public function processForView($option, $extraTypes = null, $choiceId = null) {
        if(!$option) {
            return null;
        }
        
        foreach($this->_optionsTableProperties as $property) {
            if(isset($option->option[$property])) {
                $option[$property] = $option->option[$property];
            }
        }
        unset($option->option);
       
        //Process the extra fields for displaying
        if($extraTypes === null) {
            $extraTypes = $this->ChoicesOptions->Choices->getExtraFieldTypes($choiceId);
        }
        $extras = $this->processExtrasForView($option->extra, $extraTypes);
        foreach($extras as $key => $value) {
            $option[$key] = $value;
        }
        unset($option->extra);
        
        //pr($option);
        return $option;
    }
}
