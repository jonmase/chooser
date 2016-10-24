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
            return [[],[]];
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
            
            $ruleIndexesById = [];
            foreach($rules as $key => &$rule) {
                if(!empty($rule['value_type'])) {
                    $rule['combined_type'] = $rule['type'] . '_' . $rule['value_type'];
                    
                    if($rule['value_type'] === 'range') {
                        if(!$rule['min'] && !$rule['max']) {
                            $rule['values'] = '-';
                        }
                        else if(!$rule['min']) {
                            $rule['values'] = 'Up to ' . $rule['max'];
                        }
                        else if(!$rule['max']) {
                            $rule['values'] = 'At least ' . $rule['min'];
                        }
                        else {
                            $rule['values'] = $rule['min'] . ' to ' . $rule['max'];
                        }
                    }
                    else {
                        $rule['values'] = $rule['allowed_values'];
                    }
                }
                
                if($rule['scope'] === 'category' || $rule['scope'] === 'category_all') {
                    $rule['scope_text'] = $rule['extra_field']['label'];
                    
                    if($rule['scope'] === 'category_all') {
                        $rule['scope_text'] .= ' > All Categories';
                    }
                    else {
                        $rule['scope_text'] .= ' > ' . $rule['extra_field_option']['label'];
                    }
                }
                else if($rule['scope'] === 'choice') {
                    $rule['scope_text'] = 'Entire Choice';
                }
                else {
                    $rule['scope_text'] = '?';
                }
                
                list($rule['instructions'], $rule['warning']) = $this->generateInstructionsAndWarning($rule);

                //TODO: Doing this feels quite ugly, but is intended to save time repeatedly looping through the array of rules to find the one with the right ID
                $ruleIndexesById[$rule['id']] = $key;
            }
        
            return array($rules, $ruleIndexesById);
        }
        else {
            return [[],[]];
        }
    }
    
    public function generateInstructionsAndWarning($rule) {
        if(empty($rule)) {
            return ['', ''];
        }
        
        //If the trimmed instructions value is an empty string, generate it
        $instructions = trim($rule['instructions']);
        $warning = trim($rule['warning']);
        
        if(!$instructions || !$warning) {
            $text = '';
            if($rule['hard']) {
                $text .= 'You must';
            }
            else {
                $text .= 'You should';
            }
            
            $text .= ' select ';
            
            //Work out the value text
            $pluraliseNoun = true;
            if($rule['value_type'] === 'values') {
                $values = explode(',', $rule['allowed_values']);

                $valueCount = count($values);
                if($valueCount === 1) {
                    $value = trim($values[0]);
                    $number = 'exactly ' . $value;
                    if(($value + 0) === 1) {
                        $pluraliseNoun = false;
                    }
                }
                else if($valueCount > 1) {
                    $number = 'either ';
                    $i = 1;
                    foreach($values as $value) {
                        $number = trim($value);
                        
                        //Work out the correct joining text
                        $i++;   //Increment i first
                        if($i < $valueCount) { //Next value is not the last
                            $number = ', ';
                        }
                        else if($i === $valueCount) {   //Next value is the last
                            $number = ' or ';
                        }
                    }
                }
                //Value count is 0
                else {
                    $number = 'an unspecified number of';
                }
            }
            else if($rule['value_type'] === 'range') {
                //Is there a min (can ignore it if it is 0)
                if($rule['min']) {
                    //Both min and max
                    if($rule['max']) {
                        $number = 'between ' . $rule['min'] . ' and ' . $rule['max'];
                    }
                    //Min only
                    else {
                        $number = 'at least ' . $rule['min'];
                        if(($rule['min'] + 0) === 1) {
                            $pluraliseNoun = false;
                        }
                    }
                }
                //Max only
                else if($rule['max']) {
                    $number = 'at most ' . $rule['max'];
                        if(($rule['max'] + 0) === 1) {
                            $pluraliseNoun = false;
                        }
                }
                //Both null
                else {
                    $number = 'an unspecified range of';
                }
            }

            if($rule['type'] === 'number') {
                $text .= $number . ' option' . ($pluraliseNoun?"s":"");
            }
            else if($rule['type'] === 'points') {
                $text .= 'options totalling ' . $number . ' point' . ($pluraliseNoun?"s":"");
            }
            
            //If scope is Choice, finish the sentence with a full stop
            if($rule['scope'] === 'choice') {
                $text .= '.';
            }
            //If scope is category/category_all, show the category and category field name
            //TODO: how should this be expressed? Likewise for all from field
            else if($rule['scope'] === 'category') {
                $text .= ' from the ' . $rule['extra_field']['label'] . ' category called ' . $rule['extra_field_option']['label'];
            }
            else if($rule['scope'] === 'category_all') {
                $text .= ' from each ' . $rule['extra_field']['label'] . ' category.';
            }
        }
        
        if(!$instructions) {
            $instructions = $text;
        }
        if(!$warning) {
            $warning = $text;
        }
        
        return [$instructions, $warning];
    }
}
