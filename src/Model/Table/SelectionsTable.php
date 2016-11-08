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
    
    public function findByInstanceAndUser($instanceId = null, $userId = null, $selectionIdsToOmit = []) {
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
        
        $selectionsQuery = $this->find('all')
            ->where($conditions)
            ->order(['Selections.confirmed' => 'DESC', 'Selections.modified' => 'DESC'])
            ->contain(['OptionsSelections']);
            
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
        //Or Existing Confirmed, New Unconfirmed, i.e. Editing an already confirmed selection
        // -> create new selection for saving edits (leaving confirmed as is if there is one)
        if(empty($currentSelectionEntity) || ($currentSelectionEntity->confirmed && !$requestData['selection']['confirmed'])) {
            $selectionData = $requestData['selection'];
            $selectionData['user_id'] = $userId; //Add user_id to data
            
            $selection = $this->newEntity($selectionData);
        }
        else {
            //Both Unconfirmed, i.e. Saving selected options to existing unconfirmed selection
            //Or New Confirmed (Existing either confirmed or not), i.e. Confirming selection
            // -> Just patch requestData onto entity
            $selection = $this->patchEntity($currentSelectionEntity, $requestData['selection']);

            //If new selection is confirmed, it should be the only unarchived selection
            if($selection->confirmed) {
                //So check for any other unarchived selections for this instance and user, and archive them
                $otherSelections = $this->findByInstanceAndUser($instanceId, $userId, [$currentSelectionEntity->id]);
                $this->archive($otherSelections);
            }
        }
        
        $optionsSelectionsData = [];
        
        //If just selecting options (not confirming), options will contain an array of option ids
        if(!$selection->confirmed) {
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
        else {
            foreach($requestData['options'] as $choicesOptionId => $optionsSelection) {
                $optionsSelection['choices_option_id'] = $choicesOptionId;
                
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
}
