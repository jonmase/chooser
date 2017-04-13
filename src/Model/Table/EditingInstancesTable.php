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
            return $result;
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
    

}
