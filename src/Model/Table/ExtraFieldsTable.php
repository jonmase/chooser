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
            'joinType' => 'INNER'
        ]);
        $this->hasMany('ChoicesOptionsUsers', [
            'foreignKey' => 'extra_field_id'
        ]);
        $this->hasMany('ExtraFieldOptions', [
            'foreignKey' => 'extra_field_id',
            'dependent' => true,    //Delete associated ExtraFieldOptions when ExtraField is deleted
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
    
    public function getListTypes() {
        return $this->_listTypes;
    }
}
