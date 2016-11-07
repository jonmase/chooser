<?php
namespace App\Model\Table;

use App\Model\Entity\Selection;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Selections Model
 *
 * @property \Cake\ORM\Association\BelongsTo $ChoosingInstances
 * @property \Cake\ORM\Association\BelongsTo $Users
 * @property \Cake\ORM\Association\HasMany $Allocations
 * @property \Cake\ORM\Association\HasMany $OptionsSelections
 */
class SelectionsTable extends Table
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

        $this->table('selections');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

        $this->belongsTo('ChoosingInstances', [
            'foreignKey' => 'choosing_instance_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('Users', [
            'foreignKey' => 'user_id',
            'joinType' => 'INNER'
        ]);
        $this->hasMany('Allocations', [
            'foreignKey' => 'selection_id'
        ]);
        $this->hasMany('OptionsSelections', [
            'foreignKey' => 'selection_id',
            'saveStrategy' => 'replace',    //Replace the OptionsSelections records when saving a selection
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
            ->boolean('archived');
            //->requirePresence('archived', 'create')
            //->notEmpty('archived');

        $validator
            ->allowEmpty('comments');

        $validator
            ->boolean('allocations_flag');
            //->requirePresence('allocations_flag', 'create')
            //->notEmpty('allocations_flag');

        $validator
            ->boolean('allocations_hidden');
            //->requirePresence('allocations_hidden', 'create')
            //->notEmpty('allocations_hidden');

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
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        return $rules;
    }
    
    public function findByInstanceAndUser($instanceId = null, $userId = null) {
        if(!$instanceId || !$userId) {
            return [];
        }
        
        $selectionsQuery = $this->find('all')
            ->where([
                'Selections.choosing_instance_id' => $instanceId,
                'Selections.user_id' => $userId,
                'Selections.archived' => false,
            ])
            ->contain(['OptionsSelections']);

        $selection = $selectionsQuery->first()->toArray();
        //pr($selection); exit;
        return $selection;
    }
    
    public function processForSave($instance, $requestData, $userId) {
        //If there is already an unconfirmed selection for this user/instance, use this as the basic data
        if(!empty($instance['selections'])) {
            $selection = $instance['selections'][0];
        }
        //Otherwise, use the request data
        else {
            $selectionData = $requestData;
            unset($selectionData['options_selected']);   //Remove options_selected from the data to save
            
            $selectionData['user_id'] = $userId; //Add user_id to data
            
            $selection = $this->newEntity($selectionData);
        }
        
        $optionsSelectionsData = [];
        if(!empty($requestData['options_selected'])) {
            foreach($requestData['options_selected'] as $choicesOptionId) {
                $optionsSelection = [
                    'choices_option_id' => $choicesOptionId,
                ];
                
                //If we have a selection ID, add this to the optionsSelection data
                if(!empty($selectionData['id'])) {
                    $optionsSelection['selection_id'] = $selectionData['id'];
                }
                
                $optionsSelectionsData[] = $optionsSelection;
            }
        }
        
        $selection['options_selections'] = $this->OptionsSelections->newEntities($optionsSelectionsData);

        return $selection;
    }
}
