<?php
namespace App\Model\Table;

use App\Model\Entity\ChoicesLtiContext;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * ChoicesLtiContext Model
 *
 * @property \Cake\ORM\Association\BelongsTo $LtiContext
 * @property \Cake\ORM\Association\BelongsTo $Choices
 */
class ChoicesLtiContextTable extends Table
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

        $this->table('choices_lti_context');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->belongsTo('LtiContext', [
            'foreignKey' => ['lti_consumer_key', 'lti_context_id'],
        ]);
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
            ->requirePresence('lti_consumer_key', 'create')
            ->notEmpty('lti_consumer_key');

        $validator
            ->requirePresence('lti_context_id', 'create')
            ->notEmpty('lti_context_id');

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
        $rules->add($rules->existsIn(['lti_consumer_key', 'lti_context_id'], 'LtiContext'));
        $rules->add($rules->existsIn(['choice_id'], 'Choices'));
        return $rules;
    }
    
    public function getContextChoice($tool = null) {
        if(!$tool) { return false; }

        $consumerKey = $tool->consumer->getKey();
        $contextId = $tool->context->getId();

        $choiceQuery = $this->find('all', [
            'conditions' => [
                'lti_consumer_key' => $consumerKey,
                'lti_context_id' => $contextId,                
            ]
        ]);
        if(!$choiceQuery->isEmpty()) {
            return $choiceQuery->first();
        }
        else {
            return false;
        }
    }
}
