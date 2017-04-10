<?php
namespace App\Model\Table;

use App\Model\Entity\ExtraField;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * ExtraFields Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Choices
 * @property \Cake\ORM\Association\HasMany $ChoicesOptionsUsers
 * @property \Cake\ORM\Association\HasMany $ExtraFieldOptions
 * @property \Cake\ORM\Association\HasMany $StudentPreferenceCategories
 */
class ExtraFieldsTable extends Table
{
    protected $_listTypes = ['radio', 'checkbox', 'dropdown'];
    protected $_personFields = ['title', 'given_name', 'last_name', 'email', 'department', 'college'];
    
    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->table('extra_fields');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->belongsTo('Choices', [
            'foreignKey' => 'choice_id',
            //'joinType' => 'INNER'
        ]);
        $this->hasMany('ChoicesOptionsUsers', [
            'foreignKey' => 'extra_field_id'
        ]);
        $this->hasMany('ExtraFieldOptions', [
            'foreignKey' => 'extra_field_id',
            'dependent' => true,    //Delete associated ExtraFieldOptions when ExtraField is deleted
        ]);
        $this->hasMany('Rules', [
            'foreignKey' => 'extra_field_id'
        ]);
        $this->hasMany('StudentPreferenceCategories', [
            'foreignKey' => 'extra_field_id'
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
            ->requirePresence('label', 'create')
            ->notEmpty('label');

        $validator
            ->allowEmpty('instructions');

        $validator
            ->requirePresence('type', 'create')
            ->notEmpty('type');

        $validator
            ->allowEmpty('default');

        $validator
            ->allowEmpty('extra');

        $validator
            ->boolean('show_to_students')
            ->requirePresence('show_to_students', 'create')
            ->notEmpty('show_to_students');

        $validator
            ->boolean('filterable')
            ->requirePresence('filterable', 'create')
            ->notEmpty('filterable');

        $validator
            ->boolean('sortable')
            ->requirePresence('sortable', 'create')
            ->notEmpty('sortable');

        $validator
            ->boolean('required')
            ->requirePresence('required', 'create')
            ->notEmpty('required');

        $validator
            ->boolean('in_user_defined_form')
            ->requirePresence('in_user_defined_form', 'create')
            ->notEmpty('in_user_defined_form');

        $validator
            ->boolean('rule_category')
            ->requirePresence('rule_category', 'create')
            ->notEmpty('rule_category');

        return $validator;
    }

    /**
     * Returns a rules checker object that will be used for validating
     * application integrity.
     *
     * @param \Cake\ORM\RulesChecker $rules The rules object to be modified.
     * @return \Cake\ORM\RulesChecker
     */
    public function buildRules(RulesChecker $rules)
    {
        $rules->add($rules->existsIn(['choice_id'], 'Choices'));
        return $rules;
    }
    
    public function cleanFieldName($name) {
        return strtolower(preg_replace('/[^\w]/', '_', $name));
    }
    
    public function getExtraFields($choiceId = null) {
        $extraFields = [];
        $extraFieldIndexesById = [];
        
        if($choiceId) {
            $extraFieldsQuery = $this->find('all', [
                'conditions' => ['ExtraFields.choice_id' => $choiceId],
                'contain' => ['ExtraFieldOptions'],
            ]);
            
            foreach($extraFieldsQuery as $key => $field) {
                $extraFields[] = $this->processExtraFieldsForView($field);
                
                $extraFieldIndexesById[$field['id']] = $key;
            }
        }
        
        return [$extraFields, $extraFieldIndexesById];
    }
    
    public function getListTypes() {
        return $this->_listTypes;
    }

    public function getPersonFields() {
        return $this->_personFields;
    }

    public function getRuleCategoryFields($choiceId) {
        $fieldsQuery = $this->find('all', [
            'conditions' => [
                'choice_id' => $choiceId,
                'rule_category' => true,
            ],
            'contain' => ['ExtraFieldOptions'],
            'fields' => ['id', 'choice_id', 'name', 'label', 'type', 'rule_category'],
        ]);
        
        $fields = $fieldsQuery->all();
        
        $fields = $fields->each(function($field, $key) {
            $field['value'] = $key;
        });
        
        return $fieldsQuery->toArray();
    }

    /**
     * processExtraFieldsForSave method
     * Adds extra fields as JSON to 'extra' in data and removes those extra fields from data
     * 
     * @param array $data
     * @param array|null $extraFieldNames - the fields that will be moved into 'extra'
     * @return array $data - modified data array
     */
    public function processExtraFieldsForSave($data, $extraFieldNames = null) {
        $extra = [];
        foreach($extraFieldNames as $fieldName) {
            if(!empty($data[$fieldName])) {
                $extra[$fieldName] = $data[$fieldName];
            }
            unset($data[$fieldName]);
        }
        $data['extra'] = json_encode($extra);
        return $data;
    }

    /**
     * processExtraFieldsForView method
     * Decodes JSON 'extra' field
     * 
     * @param array $extra JSON encoded extra info for field
     * @return mixed decoded JSON
     */
    public function processExtraFieldsForView($field) {
        //$field['name'] = $this->cleanFieldName($field['label']);
        
        $listTypes = $this->getListTypes();
        if(in_array($field['type'], $listTypes)) {
            $field['extra'] = [];
            $field['extra']['list_type'] = $field['type'];
            $field['type'] = 'list';
            
            //Process options
            $field['options'] = $field['extra_field_options'];  //Move extra_field_options to options
            $listOptions = [];  //Create array for storing list option labels
            foreach($field['options'] as $option) { //Loop through options
                $listOptions[] = $option['label'];  //Add label to listOptions array
            }
            $field['extra']['list_options'] = implode("\n", $listOptions);  //Join listOptions with line break
        }
        else {
            $field['extra'] = json_decode($field['extra']);
        }
        
        unset($field['extra_field_options']);
        
        return $field;
    }
}
