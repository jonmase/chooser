<?php
namespace App\Model\Table;

use App\Model\Entity\Choice;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Choices Model
 *
 * @property \Cake\ORM\Association\HasMany $ChoicesLtiContext
 * @property \Cake\ORM\Association\HasMany $ChoicesOptions
 * @property \Cake\ORM\Association\HasMany $ChoicesUsers
 * @property \Cake\ORM\Association\HasMany $ChoosingInstances
 * @property \Cake\ORM\Association\HasMany $EditingInstances
 * @property \Cake\ORM\Association\HasMany $ExtraFields
 */
class ChoicesTable extends Table
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

        $this->table('choices');
        $this->displayField('name');
        $this->primaryKey('id');

        $this->hasMany('ChoicesLtiContext', [
            'foreignKey' => 'choice_id',
        ]);
        $this->hasMany('ChoicesOptions', [
            'foreignKey' => 'choice_id',
        ]);
        $this->hasMany('ChoicesUsers', [
            'foreignKey' => 'user_id'
        ]);
        $this->hasMany('ChoosingInstances', [
            'foreignKey' => 'choice_id'
        ]);
        $this->hasMany('EditingInstances', [
            'foreignKey' => 'choice_id'
        ]);
        $this->hasMany('ExtraFields', [
            'foreignKey' => 'choice_id'
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
            ->boolean('private')
            ->requirePresence('private', 'create')
            ->notEmpty('private');

        $validator
            ->allowEmpty('instructor_default_roles');

        $validator
            ->boolean('notify_additional_permissions')
            ->requirePresence('notify_additional_permissions', 'create')
            ->notEmpty('notify_additional_permissions');

        $validator
            ->allowEmpty('notify_additional_permissions_custom');

        return $validator;
    }
    
    /**
     * Default validation rules.
     *
     * @param int $userId The DB ID of the logged in user
     * @param string $role The minimum role the user must have on the Choices that are returned
     * @return Cake\ORM\ResultSet
     */
    public function getChoices($userId = null, $role = 'view') {
        if(!$userId) {
            return false;
        }
        
        $conditions['user_id'] = $userId;
        
        if($role === 'view') {
            //Don't need any conditions, as anyone who is associated with the Choice has view role
        }
        else if($role === 'admin') {
            $conditions['admin'] = 1;
        }
        //For other roles, just need to check that the specified role, or admin, is set to 1
        else {
            $conditions['or'] = [
                $role => 1,
                'admin' => 1,
            ];
        }
        
        $choicesQuery = $this->ChoicesUsers->find('all', [
            'conditions' => $conditions,
            'contain' => ['Choices'],
        ]);
        
        $choices = $choicesQuery->all();
        
        return $choices;
    }
}
