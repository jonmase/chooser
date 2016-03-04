<?php
namespace App\Model\Table;

use App\Model\Entity\LtiShareKey;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * LtiShareKey Model
 *
 * @property \Cake\ORM\Association\BelongsTo $ShareKeys
 * @property \Cake\ORM\Association\BelongsTo $LtiContext
 */
class LtiShareKeyTable extends Table
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

        $this->table('lti_share_key');
        $this->displayField('share_key_id');
        $this->primaryKey('share_key_id');

        $this->belongsTo('ShareKeys', [
            'foreignKey' => 'share_key_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('LtiContext', [
            'foreignKey' => 'primary_context_id',
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
            ->requirePresence('primary_consumer_key', 'create')
            ->notEmpty('primary_consumer_key');

        $validator
            ->boolean('auto_approve')
            ->requirePresence('auto_approve', 'create')
            ->notEmpty('auto_approve');

        $validator
            ->dateTime('expires')
            ->requirePresence('expires', 'create')
            ->notEmpty('expires');

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
        $rules->add($rules->existsIn(['share_key_id'], 'ShareKeys'));
        $rules->add($rules->existsIn(['primary_context_id'], 'LtiContext'));
        return $rules;
    }
}
