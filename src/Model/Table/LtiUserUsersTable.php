<?php
namespace App\Model\Table;

use App\Model\Entity\LtiUserUser;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * LtiUserUsers Model
 *
 * @property \Cake\ORM\Association\BelongsTo $LtiUser
 * @property \Cake\ORM\Association\BelongsTo $LtiUserUsers
 * @property \Cake\ORM\Association\BelongsTo $Users
 * @property \Cake\ORM\Association\HasMany $LtiUserUsers
 */
class LtiUserUsersTable extends Table
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

        $this->table('lti_user_users');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->belongsTo('LtiUser', [
            'foreignKey' => ['lti_consumer_key', 'lti_context_id', 'lti_user_id'],
        ]);
        $this->belongsTo('Users', [
            'foreignKey' => 'user_id',
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
            ->allowEmpty('user_id', 'create');

        $validator
            ->requirePresence('lti_consumer_key', 'create')
            ->notEmpty('lti_consumer_key');

        $validator
            ->requirePresence('lti_context_id', 'create')
            ->notEmpty('lti_context_id');

        $validator
            ->requirePresence('lti_user_id', 'create')
            ->notEmpty('lti_user_id');

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
        $rules->add($rules->existsIn(['lti_consumer_key', 'lti_context_id', 'lti_user_id'], 'LtiUser'));
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        return $rules;
    }
}
