<?php
namespace App\Model\Table;

use App\Model\Entity\ChoosingInstance;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * ChoosingInstances Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Choices
 * @property \Cake\ORM\Association\HasMany $Rules
 * @property \Cake\ORM\Association\HasMany $RulesRelatedCategories
 * @property \Cake\ORM\Association\HasMany $RulesRelatedOptions
 * @property \Cake\ORM\Association\HasMany $Selections
 * @property \Cake\ORM\Association\HasMany $ShortlistedOptions
 * @property \Cake\ORM\Association\HasMany $StudentPreferenceCategories
 */
class ChoosingInstancesTable extends Table
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

        $this->table('choosing_instances');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('Choices', [
            'foreignKey' => 'choice_id',
            'joinType' => 'INNER'
        ]);
        $this->hasMany('Rules', [
            'foreignKey' => 'choosing_instance_id'
        ]);
        $this->hasMany('RulesRelatedCategories', [
            'foreignKey' => 'choosing_instance_id'
        ]);
        $this->hasMany('RulesRelatedOptions', [
            'foreignKey' => 'choosing_instance_id'
        ]);
        $this->hasMany('Selections', [
            'foreignKey' => 'choosing_instance_id'
        ]);
        $this->hasMany('ShortlistedOptions', [
            'foreignKey' => 'choosing_instance_id'
        ]);
        $this->hasMany('StudentPreferenceCategories', [
            'foreignKey' => 'choosing_instance_id'
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
            ->boolean('active')
            ->requirePresence('active', 'create')
            ->notEmpty('active');

        $validator
            ->allowEmpty('choosing_instructions');

        $validator
            ->boolean('editable')
            ->requirePresence('editable', 'create')
            ->notEmpty('editable');

        $validator
            ->dateTime('opens')
            ->allowEmpty('opens');

        $validator
            ->dateTime('deadline')
            ->allowEmpty('deadline');

        $validator
            ->dateTime('extension')
            ->allowEmpty('extension');

        $validator
            ->allowEmpty('preference_type');

        $validator
            ->integer('preference_points')
            ->allowEmpty('preference_points');

        $validator
            ->allowEmpty('preference_instructions');

        $validator
            ->boolean('comments_overall')
            ->requirePresence('comments_overall', 'create')
            ->notEmpty('comments_overall');

        $validator
            ->allowEmpty('comments_overall_instructions_copy1');

        $validator
            ->integer('comments_overall_limit')
            ->allowEmpty('comments_overall_limit');

        $validator
            ->boolean('comments_per_option')
            ->requirePresence('comments_per_option', 'create')
            ->notEmpty('comments_per_option');

        $validator
            ->allowEmpty('comments_per_option_instructions');

        $validator
            ->integer('comments_per_option_limit')
            ->allowEmpty('comments_per_option_limit');

        $validator
            ->boolean('editor_preferences')
            ->requirePresence('editor_preferences', 'create')
            ->notEmpty('editor_preferences');

        $validator
            ->dateTime('editor_preferences_deadline')
            ->allowEmpty('editor_preferences_deadline');

        $validator
            ->requirePresence('editor_preferences_type', 'create')
            ->notEmpty('editor_preferences_type');

        $validator
            ->integer('editor_preferences_points')
            ->allowEmpty('editor_preferences_points');

        $validator
            ->allowEmpty('editor_preferences_instructions');

        $validator
            ->allowEmpty('extra_questions');

        $validator
            ->integer('allocation_min')
            ->allowEmpty('allocation_min');

        $validator
            ->integer('allocation_max')
            ->allowEmpty('allocation_max');

        $validator
            ->boolean('notify_open')
            ->requirePresence('notify_open', 'create')
            ->notEmpty('notify_open');

        $validator
            ->allowEmpty('notify_open_extra');

        $validator
            ->boolean('notify_deadline')
            ->requirePresence('notify_deadline', 'create')
            ->notEmpty('notify_deadline');

        $validator
            ->allowEmpty('notify_deadline_extra');

        $validator
            ->boolean('notify_submission')
            ->requirePresence('notify_submission', 'create')
            ->notEmpty('notify_submission');

        $validator
            ->allowEmpty('notify_submission_extra');

        $validator
            ->boolean('notify_results_available')
            ->requirePresence('notify_results_available', 'create')
            ->notEmpty('notify_results_available');

        $validator
            ->allowEmpty('notify_results_available_extra');

        $validator
            ->boolean('notify_editor_prefs_available')
            ->requirePresence('notify_editor_prefs_available', 'create')
            ->notEmpty('notify_editor_prefs_available');

        $validator
            ->allowEmpty('notify_editor_prefs_available_extra');

        $validator
            ->boolean('notify_allocation_available')
            ->requirePresence('notify_allocation_available', 'create')
            ->notEmpty('notify_allocation_available');

        $validator
            ->allowEmpty('notify_allocation_available_extra');

        $validator
            ->boolean('notify_student_allocations')
            ->requirePresence('notify_student_allocations', 'create')
            ->notEmpty('notify_student_allocations');

        $validator
            ->allowEmpty('notify_student_allocations_extra');

        $validator
            ->boolean('notify_editor_allocations')
            ->requirePresence('notify_editor_allocations', 'create')
            ->notEmpty('notify_editor_allocations');

        $validator
            ->allowEmpty('notify_editor_allocations_extra');

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
    
    public function findActive($choiceId) {
        return $this->findByChoiceId($choiceId, true);
    }
    
    public function findInactive($choiceId) {
        return $this->findByChoiceId($choiceId, false);
    }
    
    public function findByChoiceId($choiceId = null, $active = true) {
        if(!$choiceId) {
            return [];
        }
        
        $choosingInstanceQuery = $this->find('all', [
            'conditions' => [
                'choice_id' => $choiceId,
                'active' => $active,
            ],
            'contain' => ['Rules', 'RulesRelatedCategories', 'RulesRelatedOptions', 'StudentPreferenceCategories']
        ]);
        
        return $choosingInstanceQuery->toArray();
    }
}
