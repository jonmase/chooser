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
    
    public function checkSelection($choicesOptionIds = null, $choosingInstanceId = null, $choiceId = null) {
        if($choicesOptionIds === null || !$choiceId || !$choosingInstanceId) {
            return null;
        }
        
        //Get the rules for this choosing instance
        $rulesQuery = $this->find('all', [
            'conditions' => [
                'choosing_instance_id' => $choosingInstanceId,
            ],
            'contain' => ['ExtraFields', 'ExtraFields.ExtraFieldOptions', 'ExtraFieldOptions'],
        ]);
        $rules = $rulesQuery->toArray();
        //pr($rules);

        //Get the selected options, including extra fields
        if($choicesOptionIds) {
            $selectedOptionsQuery = $this->ChoosingInstances->Choices->ChoicesOptions->find('all', [
                'conditions' => [
                    'id IN' => $choicesOptionIds
                ]
            ]);
            $selectedOptions = $selectedOptionsQuery->toArray();
        }
        else {
            $selectedOptions = [];
        }
        
        $extraTypes = $this->ChoosingInstances->Choices->getExtraFieldTypes($choiceId);
        foreach($selectedOptions as &$option) {
            $option = $this->ChoosingInstances->Choices->ChoicesOptions->Options->processForView($option, $extraTypes);
        }
        unset($option); //Clear option (object by reference) so can safely reuse later
        //pr($choicesOptionIds);
        //pr($selectedOptions);
        
        $ruleWarnings = [];
        $allowSubmit = true;
        foreach($rules as $rule) {
            
            //Work out the value (number or points) of the selected options
            $selectedValue = 0;
            if($rule['scope'] === 'choice') {
                //Choice scope and number type
                if($rule['type'] === 'number') {
                    //Count all the selected options
                    $selectedValue = count($selectedOptions);
                }
                //Choice scope and points type
                else if($rule['type'] === 'points') {
                    //Loop through selectedOptions, adding the points for each one
                    foreach($selectedOptions as $key => $option) {
                        $selectedValue += $option['points'];
                    }
                }
                
                //Check the outcome of this rule
                $ruleWarning = $this->checkRuleOutcome($rule, $selectedValue);
                
                //If there is a warning, add it to the ruleWarnings array, and check allowSubmit
                if($ruleWarning) {
                    $ruleWarnings[] = [
                        'ruleId' => $rule['id'],
                        'ruleWarning' => $ruleWarning
                    ];
                    if($allowSubmit) {
                        $allowSubmit = $this->checkAllowSubmit($rule['hard']);
                    }
                }
            }
            else if($rule['scope'] === 'category' || $rule['scope'] === 'category_all') {
                $extraFieldName = $rule['extra_field']['name'];
                $extraFieldType = $rule['extra_field']['type'];
                
                //If category scope, add the single extra field option to $extraFieldOptions
                if($rule['scope'] === 'category') {
                    $extraFieldOptions = [[
                        'label' => $rule['extra_field_option']['label'],
                        'value' => $rule['extra_field_option']['value']
                    ]];
                }
                //If category_all scope, add of the extra field options for that field to $extraFieldOptions
                else if($rule['scope'] === 'category_all') {
                    $extraFieldOptions = [];
                    foreach($rule['extra_field']['extra_field_options'] as $extraFieldOption) {
                        $extraFieldOptions[] = [
                            'label' => $extraFieldOption['label'],
                            'value' => $extraFieldOption['value']
                        ];
                    }
                    
                    //Make the rule outcomes field for this rule an array, so can add an outcome for each field option
                    $ruleWarningArray = [];
                }
                    
                //Loop through $extraFieldOptions
                $fails = 0;
                foreach($extraFieldOptions as $extraFieldOption) {
                    $selectedValue = 0; //Reset the selected value
                    
                    //Loop through the options
                    foreach($selectedOptions as $option) {
                        //Count the option if:
                        // - this is radio or dropdown type, and extra field value for this option is the rule value
                        // - this is a checkbox type and the value for the extra field option is true
                        $singleOptionFieldTypes = ['radio', 'dropdown'];
                        //pr($option[$extraFieldName]);
                        //pr($extraFieldOption['value']);
                        if((in_array($extraFieldType, $singleOptionFieldTypes) && $option[$extraFieldName] == $extraFieldOption['value'])
                          || ($extraFieldType == 'checkbox' && $option[$extraFieldName][$extraFieldOption['value']])) {
                            //Number type, add one to count
                            if($rule['type'] === 'number') {
                                $selectedValue++;
                            }
                            //Number type, add points value to count
                            else if($rule['type'] === 'points') {
                                $selectedValue += $option['points'];
                            }
                        }
                    }
                    
                    //Generate the rule outcome
                    $ruleWarning = $this->checkRuleOutcome($rule, $selectedValue);
                    
                    if($ruleWarning) {
                        $fails++;   //Increment fails count
                        
                        //If category is scope, just add the warning to the ruleWarnings array
                        if($rule['scope'] === 'category') {
                            $ruleWarningArray = $ruleWarning;
                        }
                        //If category_all scope, add the outcome for extraFieldOption to the subarray for this rule in the ruleWarnings array
                        else if($rule['scope'] === 'category_all') {
                            $ruleWarningArray[] = [
                                'categoryOption' => $extraFieldOption['value'],
                                'categoryLabel' => $extraFieldOption['label'],
                                'ruleWarning' => $ruleWarning
                            ];
                        }
                        
                        //If allowSubmit is still true, check whether this rule affects that
                        if($allowSubmit) {
                            $allowSubmit = $this->checkAllowSubmit($rule['hard']);
                        }
                    }
                    
                }
                
                if($fails > 0) {
                    $ruleWarnings[] = [
                        'ruleId' => $rule['id'],
                        'ruleWarning' => $ruleWarningArray
                    ];
                }
            }
        }
        //pr($ruleWarnings);
        //pr('Allow submit? ' . $allowSubmit);
        //exit;
        
        //Change $ruleWarnings to false if it is empty
        if(empty($ruleWarnings)) {
            $ruleWarnings = false;
        }
        
        return [$allowSubmit, $ruleWarnings];
    }
    
    public function checkAllowSubmit($hard = false) {
        if($hard) {
            return false;
        }
        else {
            return true;
        }
    }
    
    public function checkRuleOutcome($rule, $selectedValue) {
        if($rule['value_type'] === 'values') {
            $allowedValues = $this->explodeValues($rule['allowed_values']);
            
            if(count($allowedValues) > 0) {
                //Is the number of options one of the allowed values?
                if(in_array($selectedValue, $allowedValues)) {
                    $passed = true;
                }
                //Not one of the allowed values, so fail and generate explanation
                else {
                    $passed = false;
                    list($numberText, $pluraliseNoun) = $this->valuesToText($allowedValues);
                }
            }
            //Value count is 0, so just pass as this rule is not configured correctly
            else {
                $passed = true;
            }
        }
        else if($rule['value_type'] === 'range') {
            //Assume passed unless fail the min or max checkSelection
            $passed = true;
            
            //Is there a min (can ignore it if it is 0)
            if($rule['min']) {
                //Less than the min, so fail and generate explanation
                if($selectedValue < $rule['min']) {
                    $passed = false;
                }
            }
            //Is there a max
            if($rule['max']) {
                //More than the min, so fail and generate explanation
                if($selectedValue > $rule['max']) {
                    $passed = false;
                }
            } 
            
            //Explanation is the same for both min and max failures
            if(!$passed) {
                list($numberText, $pluraliseNoun) = $this->rangeToText($rule['min'], $rule['max']);
            }
        }
        
        //Generate the outcome using the $numberText and $pluraliseNoun values generated above
        $ruleWarning = false;
        if(!$passed) {
            $ruleWarning = 'Selected ' . $selectedValue;
            if($rule['type'] === 'points') {
                $ruleWarning .=  ' point' . (($selectedValue !== 1)?"s":"");
            }
            $ruleWarning .= ', ' . ($rule['hard']?'must':'should') . ' select ' . $numberText;

            if($rule['type'] === 'points') {
                $ruleWarning .= ' point' . ($pluraliseNoun?"s":"");
            }
        }
        
        return $ruleWarning;
    }
    
    public function getForInstance($instanceId = null) {
        if(!$instanceId) {
            return [[],[]];
        }
        
        $rulesQuery = $this->find('all', [
            'conditions' => [
                'choosing_instance_id' => $instanceId,
            ],
            'contain' => ['ExtraFields', 'ExtraFieldOptions'],
        ]);
        $rules = $rulesQuery->toArray();
        //pr($rules); exit;
        
        if(!empty($rules)) {
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
                $values = $this->explodeValues($rule['allowed_values']);
                list($number, $pluraliseNoun) = $this->valuesToText($values);
            }
            else if($rule['value_type'] === 'range') {
                list($number, $pluraliseNoun) = $this->rangeToText($rule['min'], $rule['max']);
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
    
    public function explodeValues($valueString) {
        $values = explode(',', $valueString);
        foreach($values as &$value) {
            $value = trim($value) + 0;  //Trim and force to be integer type
        }
        
        return $values;
    }
    
    public function rangeToText($min, $max) {
        $pluraliseNoun = true;  //Pluralise noun by default
        
        //Is there a min (can ignore it if it is 0)
        if($min) {
            //Both min and max
            if($max) {
                $text = 'between ' . $min . ' and ' . $max;
            }
            //Min only
            else {
                $text = 'at least ' . $min;
                if(($min + 0) === 1) {
                    $pluraliseNoun = false;
                }
            }
        }
        //Max only
        else if($max) {
            $text = 'no more than ' . $max;
                if(($max + 0) === 1) {
                    $pluraliseNoun = false;
                }
        }
        //Both null
        else {
            $text = '??';
        }
        
        return [$text, $pluraliseNoun];
    }

    public function valuesToText($values) {
        $pluraliseNoun = true;  //Pluralise noun by default
        
        $valueCount = count($values);
        if($valueCount === 1) {
            $value = trim($values[0]);
            $text = 'exactly ' . $value;
            if(($value + 0) === 1) {
                $pluraliseNoun = false;
            }
        }
        else if($valueCount > 1) {
            $text = 'either ';
            $i = 1;
            foreach($values as $value) {
                $text .= trim($value);
                
                //Work out the correct joining text
                $i++;   //Increment i first
                if($i < $valueCount) { //Next value is not the last
                    $text .= ', ';
                }
                else if($i === $valueCount) {   //Next value is the last
                    $text .= ' or ';
                }
            }
        }
        //Value count is 0
        else {
            $text = '??';
        }

        return [$text, $pluraliseNoun];
    }
}
