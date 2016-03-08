<?php
namespace App\Model\Table;

use App\Model\Entity\RulesRelatedOption;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * RulesRelatedOptions Model
 *
 * @property \Cake\ORM\Association\BelongsTo $ChoosingInstances
 * @property \Cake\ORM\Association\BelongsTo $Options (RelatedOptionA)
 * @property \Cake\ORM\Association\BelongsTo $Options (RelatedOptionB)
 */
class RulesRelatedOptionsTable extends Table
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

        $this->table('rules_related_options');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('ChoosingInstances', [
            'foreignKey' => 'choosing_instance_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('RelatedOptionA', [
            'className' => 'Options',
            'foreignKey' => 'option_a_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('RelatedOptionB', [
            'className' => 'Options',
            'foreignKey' => 'option_b_id',
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
            ->integer('id')
            ->allowEmpty('id', 'create');

        $validator
            ->boolean('force')
            ->requirePresence('force', 'create')
            ->notEmpty('force');

        $validator
            ->boolean('hard')
            ->requirePresence('hard', 'create')
            ->notEmpty('hard');

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
        $rules->add($rules->existsIn(['choosing_instance_id'], 'ChoosingInstances'));
        $rules->add($rules->existsIn(['option_a_id'], 'Options'));
        $rules->add($rules->existsIn(['option_b_id'], 'Options'));
        return $rules;
    }
}
