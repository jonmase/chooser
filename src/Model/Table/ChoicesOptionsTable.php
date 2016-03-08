<?php
namespace App\Model\Table;

use App\Model\Entity\ChoicesOption;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * ChoicesOptions Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Choices
 * @property \Cake\ORM\Association\BelongsTo $Options
 * @property \Cake\ORM\Association\BelongsTo $Users (Approvers)
 * @property \Cake\ORM\Association\BelongsTo $Users (Publishers)
 * @property \Cake\ORM\Association\HasMany $Allocations
 * @property \Cake\ORM\Association\HasMany $ChoicesOptionsUsers
 * @property \Cake\ORM\Association\HasMany $OptionsSelections
 * @property \Cake\ORM\Association\HasMany $ShortlistedOptions
 */
class ChoicesOptionsTable extends Table
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

        $this->table('choices_options');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('Choices', [
            'foreignKey' => 'choice_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('Options', [
            'foreignKey' => 'option_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('ApprovedBy', [
            'className' => 'Users',
            'foreignKey' => 'approver',
        ]);
        $this->belongsTo('PublishedBy', [
            'className' => 'Users',
            'foreignKey' => 'publisher',
        ]);
        $this->hasMany('Allocations', [
            'foreignKey' => 'choices_option_id'
        ]);
        $this->hasMany('ChoicesOptionsUsers', [
            'foreignKey' => 'choices_option_id'
        ]);
        $this->hasMany('OptionsSelections', [
            'foreignKey' => 'choices_option_id'
        ]);
        $this->hasMany('ShortlistedOptions', [
            'foreignKey' => 'choices_option_id'
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
            ->integer('min_places')
            ->allowEmpty('min_places');

        $validator
            ->integer('max_places')
            ->allowEmpty('max_places');

        $validator
            ->integer('points')
            ->allowEmpty('points');

        $validator
            ->integer('preference_points_min')
            ->allowEmpty('preference_points_min');

        $validator
            ->integer('preference_points_max')
            ->allowEmpty('preference_points_max');

        $validator
            ->boolean('published')
            ->requirePresence('published', 'create')
            ->notEmpty('published');

        $validator
            ->dateTime('published_date')
            ->allowEmpty('published_date');

        $validator
            ->integer('publisher')
            ->allowEmpty('publisher');

        $validator
            ->boolean('approved')
            ->requirePresence('approved', 'create')
            ->notEmpty('approved');

        $validator
            ->dateTime('approved_date')
            ->allowEmpty('approved_date');

        $validator
            ->integer('approver')
            ->allowEmpty('approver');

        $validator
            ->allowEmpty('extra');

        $validator
            ->boolean('allocations_flag')
            ->requirePresence('allocations_flag', 'create')
            ->notEmpty('allocations_flag');

        $validator
            ->boolean('allocations_hidden')
            ->requirePresence('allocations_hidden', 'create')
            ->notEmpty('allocations_hidden');

        $validator
            ->integer('revision_parent')
            ->requirePresence('revision_parent', 'create')
            ->notEmpty('revision_parent');

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
        $rules->add($rules->existsIn(['option_id'], 'Options'));
        return $rules;
    }
}
