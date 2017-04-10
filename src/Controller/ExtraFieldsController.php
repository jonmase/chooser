<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;

/**
 * ExtraFields Controller
 *
 * @property \App\Model\Table\ExtraFieldsTable $ExtraFields
 */
class ExtraFieldsController extends AppController
{
    /**
     * get method
     * Get the extra fields for a choice
     * 
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When ExtraField record not found.
     */
    public function get() {
        $this->viewBuilder()->layout('ajax');

        //Make sure the user is an admin for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isAdmin = $this->ExtraFields->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to get extra fields for this Choice.'));
        }
        
        list($extraFields, $extraFieldIndexesById) = $this->ExtraFields->getExtraFields($choiceId);

        $this->set(compact('extraFields', 'extraFieldIndexesById'));
        $this->set('_serialize', ['extraFields', 'extraFieldIndexesById']);
    }
     
    
    /**
     * save method
     * Save an extra field to the option form
     * 
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When save fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When ExtraField record not found.
     */
    public function save() {
        $this->request->allowMethod(['post']);
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isAdmin = $this->ExtraFields->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }

        $data = $this->request->data;
        $data['choice_id'] = $choiceId;
        
        //Is an existing record being updated, i.e. is there an (extra_field_id) id in the data?
        $updating = !empty($data['id']);
        
        //If updating...
        if($updating) {
            //Get the extra field
            $extraFieldInDB = $this->ExtraFields->get($data['id']);
            
            //Make sure that the choice ids match in the existing data record and new data
            if($extraFieldInDB->choice_id != $data['choice_id']) {
                throw new InternalErrorException(__('Problem with updating extra field - Choice IDs do not match'));
            }

            $listTypes = $this->ExtraFields->getListTypes();
            if(in_array($extraFieldInDB->type, $listTypes)) {
                $type = 'list';
            }
            else {
                $type = $extraFieldInDB->type;
            }
        }
        else {
            $type = $data['type'];
            $data['name'] = $this->ExtraFields->cleanFieldName($data['label']);
        }
        
        //Process bool fields
        $boolFields = [
            'required',
            'show_to_students',
            'in_user_defined_form',
            'sortable',
            'filterable',
            'rule_category',
        ];
        foreach($boolFields as $fieldName) {
            $data[$fieldName] = isset($data[$fieldName])?filter_var($data[$fieldName], FILTER_VALIDATE_BOOLEAN):false;
        }
        
        //Process non-standard fields
        if($type === 'list') {
            //List - list_type, list_options (both required)
            if(empty($data['list_type']) || empty($data['list_options'])) {
                throw new InternalErrorException(__('Please specify list type and options'));
            }
            else {
                $data['type'] = $data['list_type'];
                unset($data['list_type']);
                
                $listOptions = explode("\n", $data['list_options']);
                natcasesort($listOptions);
                $data['extra_field_options'] = [];
                foreach($listOptions as $option) {
                    if($option) {   //Make sure the option isn't blank
                        $optionData = [];
                        $optionData['label'] = $option;
                        $optionData['value'] = $this->ExtraFields->cleanFieldName($option);
                        //$data['extra_field_options'][] = $this->ExtraFields->ExtraFieldOptions->newEntity($optionData);
                        $data['extra_field_options'][] = $optionData;
                    }
                }
                unset($data['list_options']);
            }
            //If updating, delete the existing extra field options, as those specified in the edit form will be resaved as new records
            if($updating) {
                if(!$this->ExtraFields->ExtraFieldOptions->deleteAll([
                    'extra_field_id' => $data['id'],
                ])) {
                    throw new InternalErrorException(__('Error deleting existing extra field options'));
                }
            }
        }
        if($type === 'number') {
            //Number - number_min, number_max (neither required)
            $extraFieldNames = ['number_min', 'number_max', 'integer'];
            $data = $this->ExtraFields->processExtraFieldsForSave($data, $extraFieldNames);
        }

        //If updating, patch the existing record with the updated data
        if($updating) {
            $extraField = $this->ExtraFields->patchEntity($extraFieldInDB, $data);
        }
        //Create entity 
        else {
            $extraField = $this->ExtraFields->newEntity($data, ['associated' => ['ExtraFieldOptions']]);
        }
        
        if($this->ExtraFields->save($extraField)) {
            $this->set('response', 'Extra field ' . ($updating?'updated':'added'));
            
            list($extraFields, $extraFieldIndexesById) = $this->ExtraFields->getExtraFields($choiceId);
            $this->set(compact('extraFields', 'extraFieldIndexesById'));
        } 
        else {
            throw new InternalErrorException(__('Problem with ' . ($updating?'updating':'adding') . ' extra field - save failed'));
        }
    }
    
    /**
     * delete method
     * Delete an extra field from option form
     * 
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Network\Exception\InternalErrorException When delete fails.
     * @throws \Cake\Network\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When ExtraField record not found.
     */
    public function delete() {
        $this->request->allowMethod(['post', 'delete']);
        $this->viewBuilder()->layout('ajax');

        //Make sure the user is an admin for this Choice
        $choiceId = $this->SessionData->getChoiceId();
        $currentUserId = $this->Auth->user('id');
        $tool = $this->SessionData->getLtiTool();
        
        $isAdmin = $this->ExtraFields->Choices->ChoicesUsers->isAdmin($choiceId, $currentUserId, $tool);
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to delete extra field for this Choice.'));
        }

        $extraFieldId = $this->request->data['id'];
        $extraField = $this->ExtraFields->get($extraFieldId);

        if ($this->ExtraFields->delete($extraField)) {
            $this->set('response', 'Extra field deleted');
            
            list($extraFields, $extraFieldIndexesById) = $this->ExtraFields->getExtraFields($choiceId);
            $this->set(compact('extraFields', 'extraFieldIndexesById'));
        } else {
            throw new InternalErrorException(__('Problem with deleting extra field'));
        }
    }
}
