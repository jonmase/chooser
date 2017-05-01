<?php
namespace App\Model\Table;

use App\Model\Entity\EditingInstance;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * EditingInstances Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Choices
 */
class EditingInstancesTable extends Table
{
    protected $_datetimeFields = ['opens', 'deadline', 'approval_deadline'];
    protected $_boolFields = ['approval_required', 'student_defined', 'notify_open', 'notify_deadline', 'notify_submission', 'notify_approval_needed', 'notify_approval_given', 'notify_approval_rejected'];

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->table('editing_instances');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');
        $this->addBehavior('Datetime');
        $this->addBehavior('Instances');

        $this->belongsTo('Choices', [
            'foreignKey' => 'choice_id',
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
            ->allowEmpty('instructions');

        $validator
            ->integer('student_defined')
            ->requirePresence('student_defined', 'create')
            ->notEmpty('student_defined');

        $validator
            ->dateTime('opens')
            ->allowEmpty('opens');

        $validator
            ->dateTime('deadline')
            ->allowEmpty('deadline');

        $validator
            ->boolean('approval_required')
            ->requirePresence('approval_required', 'create')
            ->notEmpty('approval_required');

        $validator
            ->dateTime('approval_deadline')
            ->allowEmpty('approval_deadline');

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
            ->boolean('notify_approval_needed')
            ->requirePresence('notify_approval_needed', 'create')
            ->notEmpty('notify_approval_needed');

        $validator
            ->allowEmpty('notify_approval_needed_extra');

        $validator
            ->boolean('notify_approval_given')
            ->requirePresence('notify_approval_given', 'create')
            ->notEmpty('notify_approval_given');

        $validator
            ->allowEmpty('notify_approval_given_extra');

        $validator
            ->boolean('notify_approval_rejected')
            ->requirePresence('notify_approval_rejected', 'create')
            ->notEmpty('notify_approval_rejected');

        $validator
            ->allowEmpty('notify_approval_rejected_extra');

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
    
    public function getActive($choiceId) {
        if($result = $this->findByChoiceId($choiceId, true)->first()) {
            return $this->processForView($result);
        }
        return [];
    }
    
    public function findByChoiceId($choiceId = null, $active = true) {
        if(!$choiceId) {
            return [];
        }
        
        $editingInstanceQuery = $this->find('all', [
            'conditions' => [
                'choice_id' => $choiceId,
                'active' => $active,
            ],
        ]);

        return $editingInstanceQuery;
    }
    
    public function processForSave($requestData) {
        return $this->processInstanceForSave($requestData, $this->_datetimeFields, $this->_boolFields);
    }
    
    public function processForView($instance) {
        $processedInstance = $this->processInstanceForView($instance, $this->_datetimeFields);
        $processedInstance->editing_open = ($processedInstance->opens['passed'] && !$processedInstance->deadline['passed']);
        $processedInstance->approval_open = ($processedInstance->opens['passed'] && !$processedInstance->approval_deadline['passed']);
        return $processedInstance;
    }

    public function reset ($choiceId = null, $keepSettings = false) {
        //If no choiceId passed, return empty array
        if(!$choiceId) {
            return [];
        }
        
        //Get the editing instance
        $oldInstance = $this->Choices->EditingInstances->findByChoiceId($choiceId, true)->first();  
        
        $instancesToSave = [];
        if(!empty($oldInstance)) {
            //Convert the existing instance into an array, that we can use for creating a new copy of the instance later, if needed
            $oldInstanceArray = $oldInstance->toArray();
            
            //Set the instance to inactive
            $oldInstance->active = false;
            
            //Add the old instance to an array of instances to save
            $instancesToSave = [$oldInstance];

            //If keepSettings is set to true, create a new instance, without dates, but with all of the same settings as current
            if($keepSettings) {
                $newInstance = $this->copyInstanceWithoutDates($oldInstanceArray, $this->_datetimeFields);
                $instancesToSave[] = $newInstance;
            }
        }
        
        return $instancesToSave;
    }
}
