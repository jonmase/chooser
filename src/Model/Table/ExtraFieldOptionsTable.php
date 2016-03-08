<?php
namespace App\Model\Table;

use App\Model\Entity\ExtraFieldOption;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * ExtraFieldOptions Model
 *
 * @property \Cake\ORM\Association\BelongsTo $ExtraFields
 * @property \Cake\ORM\Association\HasMany $RulesRelatedCategories (RelatedCategoryA)
 * @property \Cake\ORM\Association\HasMany $RulesRelatedCategories (RelatedCategoryB)
 * @property \Cake\ORM\Association\HasMany $Rules
 * @property \Cake\ORM\Association\HasMany $StudentPreferenceCategories
 */
class ExtraFieldOptionsTable extends Table
{

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->table('extra_field_options');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->belongsTo('ExtraFields', [
            'foreignKey' => 'extra_field_id',
            'joinType' => 'INNER'
        ]);
        $this->hasMany('RelatedCategoryA', [
            'className' => 'RulesRelatedCategories',
            'foreignKey' => 'extra_field_option_a_id',
        ]);
        $this->hasMany('RelatedCategoryB', [
            'className' => 'RulesRelatedCategories',
            'foreignKey' => 'extra_field_option_b_id',
        ]);
        $this->hasMany('Rules', [
            'foreignKey' => 'extra_field_option_id'
        ]);
        $this->hasMany('StudentPreferenceCategories', [
            'foreignKey' => 'extra_field_option_id'
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
            ->requirePresence('value', 'create')
            ->notEmpty('value');

        $validator
            ->allowEmpty('label');

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
        $rules->add($rules->existsIn(['extra_field_id'], 'ExtraFields'));
        return $rules;
    }
}
