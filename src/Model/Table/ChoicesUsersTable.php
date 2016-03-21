<?php
namespace App\Model\Table;

use App\Model\Entity\ChoicesUser;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * ChoicesUsers Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Choices
 * @property \Cake\ORM\Association\BelongsTo $Users
 */
class ChoicesUsersTable extends Table
{
    //private $_additionalRoles = ['editor', 'approver', 'reviewer', 'allocator', 'admin'];
    private $_nonAdminRoles = ['editor', 'approver', 'reviewer', 'allocator'];

    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config)
    {
        parent::initialize($config);

        $this->table('choices_users');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->belongsTo('Choices', [
            'foreignKey' => 'choice_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('Users', [
            'foreignKey' => 'user_id',
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

        //Do not require values for these, as will be set to 0 by default in DB
        $validator
            ->boolean('editor');
            //->requirePresence('editor', 'create')
            //->notEmpty('editor');

        $validator
            ->boolean('approver');
            //->requirePresence('approver', 'create')
            //->notEmpty('approver');

        $validator
            ->boolean('reviewer');
            //->requirePresence('reviewer', 'create')
            //->notEmpty('reviewer');

        $validator
            ->boolean('allocator');
            //->requirePresence('allocator', 'create')
            //->notEmpty('allocator');

        $validator
            ->boolean('admin');
            //->requirePresence('admin', 'create')
            //->notEmpty('admin');

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
        $rules->add($rules->existsIn(['choice_id'], 'Choices'));
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        return $rules;
    }
    
    /**
     * getNonAdminRoles method
     * Returns the array of additional roles, except admin
     *
     * @return array $nonAdminRoles array of additional roles, except admin
     */
    public function getNonAdminRoles() {
        $nonAdminRoles = $this->_nonAdminRoles;
        return $nonAdminRoles;
    }

    /**
     * getRoles method
     * Looks up the User's roles for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param boolean $includeView Whether or not include 'view' as one of the roles
     * @return array $roles array of the User's roles (or empty array if not associated)
     */
    public function getRoles($choiceId = null, $userId = null, $includeView = false) {
        //If either choiceId or userId isn't set, return empty array (i.e. no role)
        if(!$choiceId || !$userId) {
            $roles = [];
        }
        
        //Look up user's permissions over this Choice in the ChoicesUsers table
        $choicesUsersQuery = $this->find('all', [
            'conditions' => ['choice_id' => $choiceId, 'user_id' => $userId],
        ]);
        
        $choicesUser = $choicesUsersQuery->first();
        $roles = $this->processRoles($choicesUser, $includeView);

        return $roles;
    }
    
    /**
     * processRoles method
     * Takes a ChoicesUsers record and process the roles into an array
     *
     * @param array $choicesUser ChoicesUsers record
     * @param boolean $includeView Whether or not include 'view' as one of the roles
     * @return array $roles array of the User's roles (or empty array if not associated)
     */
    function processRoles($choicesUser = null, $includeView = false) {
        $roles = [];
        //If the user is not associated with this Choice, return empty array, i.e. no role
        if(!empty($choicesUser)) {
            //If admin, don't need to return any other roles for this user
            if($choicesUser->admin) {
                $roles[] = 'admin';
            }
            else {
                foreach($this->_nonAdminRoles as $role) {
                    if($choicesUser->$role) {
                        $roles[] = $role;
                    }
                }
            }
            
            //Anyone associated with a Choice, and without additional permissions, still has the view role
            if(empty($roles) && $includeView) { $roles[] = 'view'; }
        }
        
        return $roles;
    }
    
    /**
     * hasAdditionalRoles method
     * Checks whether a User has additional roles (i.e. more than view) over a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @return boolean True if the User has additional roles, false if not
     */
    public function hasAdditionalRoles($choiceId = null, $userId = null) {
        //If either choiceId or userId isn't set, return false (i.e. no role)
        if(!$choiceId || !$userId) {
            return false;
        }
        
        //Get the user's roles, omitting view
        $roles = $this->getRoles($choiceId, $userId);
        
        //If the user has any role (view is omitted), they have additional permissions
        if(!empty($roles)) {
            return true;
        }
        else {
            return false;
        }
    }
    
    /**
     * isAdmin method
     * Checks whether a User is an admin for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @return boolean True if the User is an admin, false if not
     */
    public function isAdmin($choiceId = null, $userId = null) {
        //If either choiceId or userId isn't set, return false (i.e. no role)
        if(!$choiceId || !$userId) {
            return false;
        }
        
        //Get the user's roles, omitting view
        $roles = $this->getRoles($choiceId, $userId);

        //If the user has any role (view is omitted), they have additional permissions
        if(in_array('admin', $roles)) {
            return true;
        }
        else {
            return false;
        }
    }
    
}
