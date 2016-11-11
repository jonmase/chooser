<?php
namespace App\Model\Table;

use App\Model\Entity\ChoosingInstance;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\I18n\Time;

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
    protected $_datetimeFields = ['opens', 'deadline', 'extension'];

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
        $this->addBehavior('Datetime');

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

        /*$validator
            ->boolean('notify_open')
            ->requirePresence('notify_open', 'create')
            ->notEmpty('notify_open');*/

        $validator
            ->allowEmpty('notify_open_extra');

        /*$validator
            ->boolean('notify_deadline')
            ->requirePresence('notify_deadline', 'create')
            ->notEmpty('notify_deadline');*/

        $validator
            ->allowEmpty('notify_deadline_extra');

        /*$validator
            ->boolean('notify_submission')
            ->requirePresence('notify_submission', 'create')
            ->notEmpty('notify_submission');*/

        $validator
            ->allowEmpty('notify_submission_extra');

        /*$validator
            ->boolean('notify_results_available')
            ->requirePresence('notify_results_available', 'create')
            ->notEmpty('notify_results_available');*/

        $validator
            ->allowEmpty('notify_results_available_extra');

        /*$validator
            ->boolean('notify_editor_prefs_available')
            ->requirePresence('notify_editor_prefs_available', 'create')
            ->notEmpty('notify_editor_prefs_available');*/

        $validator
            ->allowEmpty('notify_editor_prefs_available_extra');

        /*$validator
            ->boolean('notify_allocation_available')
            ->requirePresence('notify_allocation_available', 'create')
            ->notEmpty('notify_allocation_available');*/

        $validator
            ->allowEmpty('notify_allocation_available_extra');

        /*$validator
            ->boolean('notify_student_allocations')
            ->requirePresence('notify_student_allocations', 'create')
            ->notEmpty('notify_student_allocations');*/

        $validator
            ->allowEmpty('notify_student_allocations_extra');

        /*$validator
            ->boolean('notify_editor_allocations')
            ->requirePresence('notify_editor_allocations', 'create')
            ->notEmpty('notify_editor_allocations');*/

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
    
    public function findActive($choiceId, $getFavourites = false, $userId = null) {
        if($result = $this->findByChoiceId($choiceId, true, $getFavourites, $userId)->first()) {
            $result = $this->processForView($result);
            return $result;
        }
        return [];
    }
    
    public function findInactive($choiceId) {
        return $this->findByChoiceId($choiceId, false)->toArray();
    }
    
    public function findByChoiceId($choiceId = null, $active = true, $getFavourites = false, $userId = null) {
        if(!$choiceId) {
            return [];
        }
        
        $contain = [];
        //$contain = ['Rules', 'RulesRelatedCategories', 'RulesRelatedOptions', 'StudentPreferenceCategories']
        if($getFavourites && $userId) {
            $contain['ShortlistedOptions'] = function($q) use ($userId) {
                return $q
                    ->select(['id', 'user_id', 'choices_option_id', 'choosing_instance_id'])
                    ->where(['ShortlistedOptions.user_id' => $userId]);
            };
        }

        $choosingInstanceQuery = $this->find('all', [
            'conditions' => [
                'choice_id' => $choiceId,
                'active' => $active,
            ],
        ])->contain($contain);

        return $choosingInstanceQuery;
    }
    
    /**
     * getWithSelection method
     * Get an instance by ID, with Selections for the specified user
     *
     * @param string|null $choosingInstanceId Choosing Instance id.
     * @param string|null $selectionId Selection id.
     * @param string|null $userId User id.
     * @return array|null $instance The instance
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    /*public function getWithSelection($choosingInstanceId = null, $selectionId = null, $userId = null) {
        if(!$choosingInstanceId || !$userId) {
            return null;
        }
        
        $instance = $this->get($choosingInstanceId, [
            'contain' => [
                'Selections' => function ($q) use ($userId) {
                   return $q
                        ->select(['id', 'choosing_instance_id', 'user_id', 'confirmed', 'archived'])
                        ->where([
                            'Selections.user_id' => $userId,
                            //'Selections.confirmed' => filter_var($this->request->data['confirmed'], FILTER_VALIDATE_BOOLEAN),
                            'Selections.archived' => false
                        ]);
                }
            ]
        ]);

        return $instance;
    }*/
    
    public function processForSave($requestData) {
        foreach($this->_datetimeFields as $field) {
            if(!empty($requestData[$field . '_date'])) {
                if(!empty($requestData[$field . '_time'])) {
                    $requestData[$field] = $this->createDatetimeForSave($requestData[$field . '_date'], $requestData[$field . '_time']);
                }
                else {
                    $requestData[$field] = $this->createDatetimeForSave($requestData[$field . '_date']);
                }
            }
            unset($requestData[$field . '_date'], $requestData[$field . '_time']);
        }
        
        $boolFields = ['editable', 'preference', 'comments_overall', 'comments_per_option', 'editor_preferences', 'notify_open', 'notify_deadline', 'notify_submission', 'notify_results_available', 'notify_editor_prefs_available', 'notify_allocation_available', 'notify_student_allocations', 'notify_editor_allocations'];
        
        foreach($boolFields as $field) {
            if(!empty($requestData[$field])) {  //If field is not empty, convert it to bool
                $requestData[$field] = filter_var($requestData[$field], FILTER_VALIDATE_BOOLEAN);
            }
            else {  //Empty fields are always false
                $requestData[$field] = false;
            }
            
            //$requestData[$field] = !empty($requestData[$field]) || filter_var($requestData[$field], FILTER_VALIDATE_BOOLEAN);
        }

        //pr($requestData);
        return $requestData;
    }
    
    public function processForView($instance) {
        $time = Time::now();
        foreach($this->_datetimeFields as $field) {
            $datetimeField = [];
            if(!empty($instance[$field])) {
                $date = $instance[$field];
                
                $instance[$field] = $this->formatDatetimeObjectForView($date);
                
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
                if($field === 'opens') {
                    $instance[$field] = ['passed' => true];
                }
                //Otherwise (deadline or extension), set to false, so it won't have closed
                else {
                    $instance[$field] = ['passed' => false];
                }
            }
        }
        
        //exit;
        return $instance;
    }

}
