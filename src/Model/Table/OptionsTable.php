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
    
    public function getForView($choiceId, $userId) {
        $options = $this->ChoicesOptions->ChoicesOptionsUsers->find('all', [
            'conditions' => [
                'ChoicesOptions.choice_id' => $choiceId,
                'ChoicesOptions.revision_parent' => 0,
                'ChoicesOptionsUsers.user_id' => $userId,
            ],
            'contain' => ['ChoicesOptions' => ['Options']],
        ]);
        
        $options = $options->toArray();
        foreach($options as &$option) {
            $option = $option->choices_option;    //Ignore ChoicesOptionsUser data at top level
            $option = $this->processForView($option);
        }
        
        return $options;
    }
    
    public function getChoicesOptionsTableProperties() {
        return $this->_choicesOptionsTableProperties;
    }
    public function getOptionsTableProperties() {
        return $this->_optionsTableProperties;
    }
    
    public function processExtrasForSave($extras) {
        //TODO: Work out how this should be done
        $extrasJSON = json_encode($extras);
        return $extrasJSON;
    }

    public function processExtrasForView($extrasJSON) {
        //TODO: Work out how this should be done
        $extras = (array) json_decode($extrasJSON);
        return $extras;
    }

    public function processForSave($choiceId, $userId, $requestData) {
        //Set up the basic choicesOption data
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
        
        //Add the choicesOption fields from the form
        foreach($this->_choicesOptionsTableProperties as $property) {
            if(isset($requestData[$property])) {
                $choicesOptionData[$property] = $requestData[$property];
                unset($requestData[$property]);
            }
        }
        
        //Set up the basic option data
        $optionData = ['revision_parent' => 0];
        
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
       
        //Set up the choicesOptionsUser record for the editor
        //TODO: Connect up this user (and any others) with extra fields
        $editor = [
            'user_id' => $userId,
            'editor' => 1,
            'visible_to_students' => 0,
        ];
        $choicesOptionData['choices_options_users'] = [$editor];
        
        //Remaining fields are extra fields
        $choicesOptionData['extra'] = $this->processExtrasForSave($requestData);
        //pr($choicesOptionData);
        
        $choicesOption = $this->ChoicesOptions->newEntity($choicesOptionData);

        return $choicesOption;
    }
    
    public function processForView($option) {
        foreach($this->_optionsTableProperties as $property) {
            if(isset($option->option[$property])) {
                $option[$property] = $option->option[$property];
            }
        }
        unset($option->option);
       
        $extras = $this->processExtrasForView($option->extra);
        foreach($extras as $key => $value) {
            $option[$key] = $value;
        }
        unset($option->extra);
        
        //pr($option);
        return $option;
    }
}
