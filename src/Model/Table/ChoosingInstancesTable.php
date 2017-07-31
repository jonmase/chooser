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
    protected $_datetimeFields = ['opens', 'deadline', 'extension'];
    protected $_boolFields = ['choosable', 'editable', 'preference', 'comments_overall', 'comments_per_option', 'editor_preferences', 'notify_open', 'notify_deadline', 'notify_submission', 'notify_results_available', 'notify_editor_prefs_available', 'notify_allocation_available', 'notify_student_allocations', 'notify_editor_allocations'];

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
        $this->addBehavior('Instances');

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
            ->boolean('choosable')
            ->requirePresence('choosable', 'create')
            ->notEmpty('choosable');

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
            ->allowEmpty('review_instructions');

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

        /*$validator
            ->boolean('editor_preferences')
            ->requirePresence('editor_preferences', 'create')
            ->notEmpty('editor_preferences');*/

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
    
    public function getActive($choiceId, $getFavourites = false, $userId = null) {
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
        return $this->processInstanceForSave($requestData, $this->_datetimeFields, $this->_boolFields);
    }
    
    public function processForView($instance) {
        return $this->processInstanceForView($instance, $this->_datetimeFields);
    }

    public function reset ($choiceId = null, $keepRules = false) {
        //If no choiceId passed, return empty array
        if(!$choiceId) {
            return [];
        }
        
        //Get the choosing instance
        $oldInstance = $this->Choices->ChoosingInstances->findByChoiceId($choiceId, true)->first();

        $instancesToSave = [];
        if(!empty($oldInstance)) {
            //Convert the existing instance into an array, that we can use for creating a new copy of the instance later, if needed
            $oldInstanceArray = $oldInstance->toArray();
            
            //Set the instance to inactive
            $oldInstance->active = false;    
            
            //Find and archive all the selections
            $selections = $this->Selections->findByInstance($oldInstance->id);
            $oldInstance['selections'] = $this->Selections->setArchived($selections);
            
            //Add the old instance to the array of instances to save
            $instancesToSave[] = $oldInstance;

            //If settings is set to true, create a new instance, without dates, but with all of the same settings as current
            if($keepSettings) {
                $newInstance = $this->copyInstanceWithoutDates($oldInstanceArray, $this->_datetimeFields);
            }
            
            //If rules is true, save the rules against the new instance
            if($keepRules) {
                //If there is not already a new instance (i.e. if settings was set to false), create a new empty instance for saving the rules
                if(empty($newInstance)) {
                    $newInstanceArray = [
                        'choice_id' => $choiceId,
                        'active' => 1,
                        'choosable' => 1,
                        'editable' => 1,
                        'preference' => 0,
                        'comments_overall' => 0,
                        'comments_per_option' => 0,
                    ];
                    $newInstance = $this->newEntity($newInstanceArray);
                }
                
                //Get the instance with all its rules (inc related)
                //Setup an array with the table and Model names for the types of rules
                //Values used for the query contain 
                $ruleTypes = [
                    'rules' => 'Rules',
                    //Do not use related for now, as they have not been set up yet
                    //'rules_related_categories' => 'RulesRelatedCategories',
                    //'rules_related_options' => 'RulesRelatedOptions',
                ];
                
                $rules = $this->get($oldInstance->id, [
                    'fields' => ['id'],
                    'contain' => array_values($ruleTypes)
                ]);
                
                foreach($ruleTypes as $table => $model) {
                    $newInstance[$table] = [];
                    foreach($rules[$table] as $rule) {
                        //Unset the rule id and choosing_instance_id, plus created/modified
                        unset($rule->id);
                        unset($rule->choosing_instance_id);
                        $rule = $this->unsetCreatedModified($rule);
                        $rule->isNew(true); //Force it to be considered new
                        $newInstance[$table][] = $rule; //Add it to the instance
                    }
                }
            }
            
            if(!empty($newInstance)) {
                $instancesToSave[] = $newInstance;
            }
        }
        
        return $instancesToSave;
    }
}
