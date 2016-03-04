<?php
namespace App\Model\Table;

use App\Model\Entity\LtiConsumer;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * LtiConsumer Model
 *
 */
class LtiConsumerTable extends Table
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

        $this->table('lti_consumer');
        $this->displayField('name');
        $this->primaryKey('consumer_key');

        $this->addBehavior('Timestamp');
        
        $this->hasMany('LtiContext', [
            'foreignKey' => 'consumer_key',
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
            ->requirePresence('name', 'create')
            ->notEmpty('name');

        $validator
            ->requirePresence('secret', 'create')
            ->notEmpty('secret');

        $validator
            ->allowEmpty('lti_version');

        $validator
            ->allowEmpty('consumer_name');

        $validator
            ->allowEmpty('consumer_version');

        $validator
            ->allowEmpty('consumer_guid');

        $validator
            ->allowEmpty('css_path');

        $validator
            ->boolean('protected')
            ->requirePresence('protected', 'create')
            ->notEmpty('protected');

        $validator
            ->boolean('enabled')
            ->requirePresence('enabled', 'create')
            ->notEmpty('enabled');

        $validator
            ->dateTime('enable_from')
            ->allowEmpty('enable_from');

        $validator
            ->dateTime('enable_until')
            ->allowEmpty('enable_until');

        $validator
            ->date('last_access')
            ->allowEmpty('last_access');

        return $validator;
    }
}
