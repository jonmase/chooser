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
        $this->addBehavior('Datetime');

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
    
    public function formatDate($date = null) {
        if(!$date) {
            return null;
        }
        
        $formattedDate = $this->formatDatetimeObjectForView($date);
        return $formattedDate;
    }
    
    public function findByInstanceAndUser($instanceId = null, $userId = null, $containSelectedOptions = true, $selectionIdsToOmit = []) {
        if(!$instanceId || !$userId) {
            return [];
        }
        
        $conditions = [
            'Selections.choosing_instance_id' => $instanceId,
            'Selections.user_id' => $userId,
            'Selections.archived' => false,
        ];
        
        if(!empty($selectionIdsToOmit)) {
            $conditions['Selections.id NOT IN'] = $selectionIdsToOmit;
        }
        
        $instance = $this->ChoosingInstances->get($instanceId, ['fields' => ['choice_id']]);
        
        $selectionsQuery = $this->find('all')
            ->where($conditions)
            ->order(['Selections.confirmed' => 'DESC', 'Selections.modified' => 'DESC']);
            
        if($containSelectedOptions) {
            //If required contian the selected options, sorted by Option code and title
            $selectionsQuery->contain([
                'OptionsSelections' => [
                    'sort' => $this->OptionsSelections->ChoicesOptions->Options->getSortOrder($instance->choice_id),
                    'ChoicesOptions' => [
                        'fields' => ['ChoicesOptions.id'],
                        'Options' => [
                            'fields' => ['Options.code', 'Options.title']
                        ]
                    ]
                ]
            ]);
        }
            
        $selections = $selectionsQuery->toArray();

        foreach($selections as &$selection) {
            $selection['modified'] = $this->formatDate($selection['modified']);
        }

        return $selections;
    }
    
    /**
     * getIdInstanceAndUser method
     * Get a selection by ID, but also use instance and user as conditions, to ensure the selection ID is for this instance and user
     *
     */
    public function getByIdInstanceAndUser($selectionId = null, $instanceId = null, $userId = null) {
        if(!$selectionId || !$instanceId || !$userId) {
            return [];
        }
        
        $selectionsQuery = $this->find('all')
            ->where([
                'Selections.id' => $selectionId,
                'Selections.choosing_instance_id' => $instanceId,
                'Selections.user_id' => $userId,
                'Selections.archived' => false,
            ]);
            //->contain(['OptionsSelections']);

        $selection = $selectionsQuery->first();
        //pr($selection); exit;
        return $selection;
    }
    
    public function getForResults($choosingInstance) {
        if(!$choosingInstance) {
            return [[],[]];
        }
        
        $optionsSelectionsSort = [];
        if($choosingInstance['preference']) {
            if($choosingInstance['preference_type'] === 'rank') {
                $optionsSelectionsSort = ['OptionsSelections.rank' => 'ASC'];
            }
            else if($choosingInstance['preference_type'] === 'points') {
                $optionsSelectionsSort = ['OptionsSelections.points' => 'DESC'];
            }
        }
        
        $selectionsQuery = $this->find('all', [
            'conditions' => [
                'choosing_instance_id' => $choosingInstance->id,
                'archived' => 0,
                'confirmed' => 1,   //TODO: include unsubmitted as well, with filter to choose whether to show them
            ],
            //'contain' => ['OptionsSelections.ChoicesOptions.Options', 'Users']
            'contain' => ['OptionsSelections' => ['sort' => $optionsSelectionsSort], 'Users'],
            'order' => ['Selections.modified' => 'DESC']
        ]);
        $selections = $selectionsQuery->toArray();
        
        //Array for basic statistics on the results
        $statistics = [
            'selection_count' => count($selections),
            'confirmed_count' => 0,
        ];
        
        $optionsSelectedCounts = [];
        $optionsSelectedBy = [];
        
        $selectionIndexesById = [];
        foreach($selections as $key => &$selection) {
            if($selection['confirmed']) {
                $statistics['confirmed_count']++;
            }
            
            $selectionIndexesById[$selection['id']] = $key;
            
            $selection['modified'] = $this->formatDatetimeObjectForView($selection['modified']);
            $selection['option_count'] = count($selection['options_selections']);
            
            $optionsSelectedIdsOrdered = [];
            $optionsSelectedById = [];
            
            foreach($selection['options_selections'] as $optionSelected) {
                //Convert the selected options to the correct format for the option-list component
                $optionsSelectedIdsOrdered[] = $optionSelected['choices_option_id'];
                $optionsSelectedById[$optionSelected['choices_option_id']] = $optionSelected;
                
                //If the selection is confirmed, increment the counts for the chosen options, and record that the option is selected by this user
                if($selection['confirmed']) {
                    //If option ID does not already have a count
                    if(!isset($optionsSelectedCounts[$optionSelected['choices_option_id']])) {
                        $optionsSelectedCounts[$optionSelected['choices_option_id']] = 1;
                    }
                    else {
                        $optionsSelectedCounts[$optionSelected['choices_option_id']]++;
                    }
                    
                    if(!isset($optionsSelectedBy[$optionSelected['choices_option_id']])) {
                        $optionsSelectedBy[$optionSelected['choices_option_id']] = [];
                    }
                    $optionsSelectedBy[$optionSelected['choices_option_id']][] = $selection['id'];
                }
            }
            
            $selection['options_selected_ids_ordered'] = $optionsSelectedIdsOrdered;
            $selection['options_selected_by_id'] = $optionsSelectedById;
            unset($selection['options_selections']);
        }        
        
        $options = $this->OptionsSelections->ChoicesOptions->Options->getForView($choosingInstance->choice_id, true, true);
        
        $optionIndexesById = [];
        foreach($options as $key => &$option) {
            $optionIndexesById[$option['id']] = $key;
            
            //If option ID is set in optionsSelectedCounts, use the count from that, and add selected_by to the array
            if(isset($optionsSelectedCounts[$option['id']])) {
                $option['count'] = $optionsSelectedCounts[$option['id']];
                $option['selected_by'] = $optionsSelectedBy[$option['id']];
            }
            //Otherwise, option hasn't been chosen, so set count to 0 and selected_by as empty array
            else {
                $option['count'] = 0;
                $option['selected_by'] = [];
            }
        }
        
        return [$options, $optionIndexesById, $selections, $selectionIndexesById, $statistics];
    }
    
    public function archive($selections = []) {
        if(!empty($selections)) {
            $selectionsToArchive = [];
            foreach($selections as $selection) {
                $selectionEntity = $this->get($selection['id']);
                $selectionEntity->archived = true;
                $this->save($selectionEntity);
            }
        }
    }
    
    public function processForSave($requestData, $userId) {
        //Extract the instance and selection IDs from the request data
        $instanceId = $requestData['selection']['choosing_instance_id'];
        $selectionId = $requestData['selection']['id'];
        //Unset the selection ID in the request data, as we do not necessarily want to save to the same selection
        unset($requestData['selection']['id']);
        
        //Make sure the confirmed value is a bool not a string
        $requestData['selection']['confirmed'] = filter_var($requestData['selection']['confirmed'], FILTER_VALIDATE_BOOLEAN);
        
        if($selectionId) {
            $currentSelectionEntity = $this->getByIdInstanceAndUser($selectionId, $instanceId, $userId);
        }
        else {
            $currentSelectionEntity = null;
        }
        
        //No Existing selection 
        // -> create new selection for saving edits
        if(empty($currentSelectionEntity)) {
            $selectionData = $requestData['selection'];
            $selectionData['user_id'] = $userId; //Add user_id to data
            
            $selection = $this->newEntity($selectionData);
        }
        //Existing Confirmed, New Unconfirmed, i.e. Editing an already confirmed selection
        //Patch the existing $selection entity with the request data//
        //Then unset the selection id and set it to new, so it is saved as a new record, but with the existing data, e.g. comments
        else if($currentSelectionEntity->confirmed && !$requestData['selection']['confirmed']) {
            $selection = $this->patchEntity($currentSelectionEntity, $requestData['selection']);
            unset($selection->id);
            $selection->isNew(true);
        }
        //Both Unconfirmed, i.e. Saving selected options to existing unconfirmed selection
        //Or New Confirmed (Existing either confirmed or not), i.e. Confirming selection
        // -> Just patch requestData onto entity
        else {
            $selection = $this->patchEntity($currentSelectionEntity, $requestData['selection']);

            //If new selection is confirmed, it should be the only unarchived selection
            if($selection->confirmed) {
                //So check for any other unarchived selections for this instance and user, and archive them
                $otherSelections = $this->findByInstanceAndUser($instanceId, $userId, false, [$currentSelectionEntity->id]);
                $this->archive($otherSelections);
            }
        }
        
        $optionsSelectionsData = [];
        
        //If just selecting options (not confirming), options will contain an array of option ids
        /*if(!$selection->confirmed) {
            foreach($requestData['options'] as $choicesOptionId) {
                $optionsSelection = [
                    'choices_option_id' => $choicesOptionId,
                ];
                
                //If we have a selection ID, add this to the optionsSelection data
                if(!empty($selection->id)) {
                    $optionsSelection['selection_id'] = $selection->id;
                }
                
                $optionsSelectionsData[] = $optionsSelection;
            }
        }
        //If confirming options (not selecting), options will be an array of option details, with the ID as the key
        else {*/
        
        
        if(!empty($requestData['options'])) {
            foreach($requestData['options'] as $optionsSelection) {
                //If we have a selection ID, add this to the optionsSelection data
                if(!empty($selection->id)) {
                    $optionsSelection['selection_id'] = $selection->id;
                }
                
                $optionsSelectionsData[] = $optionsSelection;
            }
        }
        
        $selection['options_selections'] = $this->OptionsSelections->newEntities($optionsSelectionsData);

        return $selection;
    }
    
    public function processSelectedOptions($selection = null) {
        if(empty($selection)) {
            return [[], [], []];
        }
        
        $optionsSelected = [];
        $optionsSelectedIds = [];
        $optionsSelectedIdsPreferenceOrder = [];
        $optionsSelectedIdsTableOrdered = [];
        $optionsSelectedIdsUnordered = [];
        foreach($selection['options_selections'] as $option) {
            //If option is an object (options_selections Entity), convert to array
            if(is_object($option)) {
                $option = $option->toArray();
            }
            
            //Just add the option IDs to the selected array in the order they come
            //Sorting according to the table sort order will be done on the frontend
            $optionsSelectedIds[] = $option['choices_option_id'];
            
            //If a rank is set for this option, add the option to the preference order array
            if(isset($option['rank']) && $option['rank'] !== null) {    
                $optionsSelectedIdsPreferenceOrder[$option['rank']] = $option['choices_option_id'];
            }
            //If no rank but tableOrder is set, add to the TableOrdered array
            else if(isset($option['table_order'])) {  
                $optionsSelectedIdsTableOrdered[$option['table_order']] = $option['choices_option_id'];
            }
            //If no rank or tableOrder, add to the unordered array
            else {  
                $optionsSelectedIdsUnordered[] = $option['choices_option_id'];
            }
            unset($option['choices_option']);
            $optionsSelected[$option['choices_option_id']] = $option;
        }
        //Sort (by keys) and reindex optionsSelectedIdsPreferenceOrder
        ksort($optionsSelectedIdsPreferenceOrder);
        $optionsSelectedIdsPreferenceOrder = array_values($optionsSelectedIdsPreferenceOrder);
        
        //Sort (by keys) and reindex optionsSelectedIdsTableOrdered
        ksort($optionsSelectedIdsTableOrdered);
        $optionsSelectedIdsTableOrdered = array_values($optionsSelectedIdsTableOrdered);
        
        //Append the tableOrder and unranked options to the end of the array
        $optionsSelectedIdsPreferenceOrder = array_merge($optionsSelectedIdsPreferenceOrder, $optionsSelectedIdsTableOrdered, $optionsSelectedIdsUnordered);
        
        unset($selection['options_selections']);

        return [$optionsSelected, $optionsSelectedIds, $optionsSelectedIdsPreferenceOrder];
    }
}
