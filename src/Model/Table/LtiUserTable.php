<?php
namespace App\Model\Table;

use App\Model\Entity\LtiUser;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * LtiUser Model
 *
 * @property \Cake\ORM\Association\BelongsTo $LtiContext
 * @property \Cake\ORM\Association\BelongsTo $Users
 */
class LtiUserTable extends Table
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

        $this->table('lti_user');
        $this->displayField('consumer_key');
        $this->primaryKey(['consumer_key', 'context_id', 'user_id']);

        $this->addBehavior('Timestamp');

        $this->belongsTo('LtiContext', [
            'foreignKey' => ['consumer_key', 'context_id'],
        ]);
        $this->hasOne('LtiUserUsers', [
            'foreignKey' => ['lti_consumer_key', 'lti_context_id', 'lti_user_id'],
            'joinType' => 'INNER'
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
            ->allowEmpty('consumer_key', 'create');

        $validator
            ->requirePresence('lti_result_sourcedid', 'create')
            ->notEmpty('lti_result_sourcedid');

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
        $rules->add($rules->existsIn(['consumer_key', 'context_id'], 'LtiContext'));
        return $rules;
    }
}
