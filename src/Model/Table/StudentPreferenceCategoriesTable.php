<?php
namespace App\Model\Table;

use App\Model\Entity\StudentPreferenceCategory;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * StudentPreferenceCategories Model
 *
 * @property \Cake\ORM\Association\BelongsTo $ChoosingInstances
 * @property \Cake\ORM\Association\BelongsTo $ExtraFields
 * @property \Cake\ORM\Association\BelongsTo $ExtraFieldOptions
 * @property \Cake\ORM\Association\HasMany $OptionsSelections
 */
class StudentPreferenceCategoriesTable extends Table
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

        $this->table('student_preference_categories');
        $this->displayField('name');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('ChoosingInstances', [
            'foreignKey' => 'choosing_instance_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('ExtraFields', [
            'foreignKey' => 'extra_field_id'
        ]);
        $this->belongsTo('ExtraFieldOptions', [
            'foreignKey' => 'extra_field_option_id'
        ]);
        $this->hasMany('OptionsSelections', [
            'foreignKey' => 'student_preference_category_id'
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
            ->requirePresence('name', 'create')
            ->notEmpty('name');

        $validator
            ->allowEmpty('description');

        $validator
            ->requirePresence('type', 'create')
            ->notEmpty('type');

        $validator
            ->integer('points')
            ->allowEmpty('points');

        $validator
            ->integer('min')
            ->allowEmpty('min');

        $validator
            ->integer('max')
            ->allowEmpty('max');

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
        $rules->add($rules->existsIn(['choosing_instance_id'], 'ChoosingInstances'));
        $rules->add($rules->existsIn(['extra_field_id'], 'ExtraFields'));
        $rules->add($rules->existsIn(['extra_field_option_id'], 'ExtraFieldOptions'));
        return $rules;
    }
}
