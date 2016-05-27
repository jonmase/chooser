<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;
use Cake\Network\Exception\MethodNotAllowedException;

/**
 * ExtraFields Controller
 *
 * @property \App\Model\Table\ExtraFieldsTable $ExtraFields
 */
class ExtraFieldsController extends AppController
{
    /**
     * save method
     * Save an extra field to the option form
     * 
     * @param string|null $id Choice id.
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When Choice record not found.
     * @throws \Cake\Datasource\Exception\InternalErrorException When save fails.
     */
    public function save($id = null) {
        $this->viewBuilder()->layout('ajax');
        
        //Make sure the user is an admin for this Choice
        $isAdmin = $this->ExtraFields->Choices->ChoicesUsers->isAdmin($id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }

        if ($this->request->is('post')) {
            //pr($this->request->data);
            //exit;
            $data = $this->request->data;
            $data['choice_id'] = $id;
            
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
                //pr($extraFieldInDB);
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
                    //$extraFieldNames = ['list_type'];
                    //$data = $this->ExtraFields->processExtraFieldsForSave($data, $extraFieldNames);
                    $data['type'] = $data['list_type'];
                    unset($data['list_type']);
                    
                    $listOptions = explode("\n", $data['list_options']);
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
            //pr($data);

            //If updating, patch the existing record with the updated data
            if($updating) {
                $extraField = $this->ExtraFields->patchEntity($extraFieldInDB, $data);
            }
            //Create entity 
            else {
                $extraField = $this->ExtraFields->newEntity($data, ['associated' => ['ExtraFieldOptions']]);
            }
            //pr($extraField);
            //exit;
            
            if($this->ExtraFields->save($extraField)) {
                $this->set('response', 'Extra field ' . ($updating?'updated':'added'));
                
                $extraField = $this->ExtraFields->processExtraFieldsForView($extraField);
                $this->set('field', $extraField);
            } 
            else {
                throw new InternalErrorException(__('Problem with ' . ($updating?'updating':'adding') . ' extra field - save failed'));
            }
        }
        else {
            throw new MethodNotAllowedException(__('Adding/updating extra field requires POST'));
        }
    }
    
    /**
     * delete method
     * Delete an extra field from option form
     * 
     * @return \Cake\Network\Response|null Sends success reponse message.
     * @throws \Cake\Network\Exception\ForbiddenException If user is not an Admin
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When ExtraField record not found.
     * @throws \Cake\Datasource\Exception\InternalErrorException When delete fails.
     */
    public function delete() {
        $this->request->allowMethod(['post', 'delete']);
        $this->viewBuilder()->layout('ajax');

        $extraFieldId = $this->request->data['id'];
        $extraField = $this->ExtraFields->get($extraFieldId);

        //Make sure the user is an admin for this Choice
        $isAdmin = $this->ExtraFields->Choices->ChoicesUsers->isAdmin($extraField->choice_id, $this->Auth->user('id'));
        if(empty($isAdmin)) {
            throw new ForbiddenException(__('Not permitted to edit users for this Choice.'));
        }

        if ($this->ExtraFields->delete($extraField)) {
            $this->set('response', 'Extra field deleted');
            $this->set('fieldId', $extraFieldId);
        } else {
            throw new InternalErrorException(__('Problem with deleting extra field'));
        }
    }
}
