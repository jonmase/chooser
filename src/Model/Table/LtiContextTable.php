<?php
namespace App\Model\Table;

use App\Model\Entity\LtiContext;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * LtiContext Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Contexts
 * @property \Cake\ORM\Association\BelongsTo $LtiContexts
 * @property \Cake\ORM\Association\BelongsTo $LtiResources
 * @property \Cake\ORM\Association\BelongsTo $LtiContext
 */
class LtiContextTable extends Table
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

        $this->table('lti_context');
        $this->displayField('title');
        $this->primaryKey(['consumer_key', 'context_id']);

        $this->addBehavior('Timestamp');

        $this->belongsTo('LtiConsumer', [
            'foreignKey' => 'consumer_key'
        ]);
        $this->hasMany('LtiUser', [
            'foreignKey' => ['consumer_key', 'context_id'],
            'joinType' => 'INNER'
        ]);
        $this->hasOne('ChoicesLtiContext', [
            'foreignKey' => ['lti_consumer_key', 'lti_context_id'],
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
            ->requirePresence('title', 'create')
            ->notEmpty('title');

        $validator
            ->allowEmpty('settings');

        $validator
            ->allowEmpty('primary_consumer_key');

        $validator
            ->boolean('share_approved')
            ->allowEmpty('share_approved');

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
        $rules->add($rules->existsIn(['consumer_key'], 'LtiConsumer'));
        return $rules;
    }
}
