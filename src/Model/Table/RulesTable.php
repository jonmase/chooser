<?php
namespace App\Model\Table;

use App\Model\Entity\Rule;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Rules Model
 *
 * @property \Cake\ORM\Association\BelongsTo $ChoosingInstances
 * @property \Cake\ORM\Association\BelongsTo $ExtraFieldOptions
 */
class RulesTable extends Table
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

        $this->table('rules');
        $this->displayField('name');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('ChoosingInstances', [
            'foreignKey' => 'choosing_instance_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('ExtraFields', [
            'foreignKey' => 'extra_field_id'
        ]);
        $this->belongsTo('ExtraFieldOptions', [
            'foreignKey' => 'extra_field_option_id'
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
            ->requirePresence('name', 'create')
            ->notEmpty('name');

        $validator
            ->allowEmpty('instructions');

        $validator
            ->allowEmpty('warning');

        $validator
            ->requirePresence('type', 'create')
            ->notEmpty('type');

        $validator
            ->allowEmpty('value_type');

        $validator
            ->boolean('hard')
            ->requirePresence('hard', 'create')
            ->notEmpty('hard');

        $validator
            ->allowEmpty('scope');

        $validator
            ->integer('max')
            ->allowEmpty('max');

        $validator
            ->integer('min')
            ->allowEmpty('min');

        $validator
            ->allowEmpty('allowed_values');

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
        $rules->add($rules->existsIn(['extra_field_option_id'], 'ExtraFieldOptions'));
        return $rules;
    }
    
    public function getForChoice($choiceId = null) {
        if(!$choiceId) {
            return [];
        }
        
        $instanceQuery = $this->ChoosingInstances->find('all', [
            'conditions' => [
                'choice_id' => $choiceId,
                'active' => 1,
            ],
            'contain' => ['Rules' => ['ExtraFields', 'ExtraFieldOptions']],
        ]);
        
        if(!$instanceQuery->isEmpty()) {
            $instance = $instanceQuery->first();
            $rules = $instance->rules;
            
            //TODO: This feels quite ugly/hard work, but is intended to save time repeatedly looping through the array of rules to find the one with the right ID
            $ruleIds = [];
            foreach($rules as $key => &$rule) {
                if(!empty($rule['value_type'])) {
                    $rule['combined_type'] = $rule['type'] . '_' . $rule['value_type'];
                    
                    if($rule['value_type'] === 'range') {
                        $rule['values'] = $rule['min'] + ' to ' + $rule['max'];
                    }
                    else {
                        $rule['values'] = $rule['allowed_values'];
                    }
                }
                
                $ruleIds[$rule['id']] = $key;
            }
        
            return array($rules, $ruleIds);
        }
        else {
            return [];
        }
    }
}
