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
    private $_nonAdminRoles = [
        [
            'id' => 'editor', 
            'title' => 'Editor', 
            'description' => 'can create and edit their own options, and edit their profile',
            //'description' => 'can create and edit their own options, edit their profile and see who has chosen their options',
        ],
        /*[
            'id' => 'approver', 
            'title' => 'Approver', 
            'description' => 'only relevant in Choices that include an approval step, Approvers can view and approve or reject options that have been published by editors',
        ],*/
        [
            'id' => 'reviewer', 
            'title' => 'Reviewer', 
            'description' => 'can view and download the results',
        ],
        /*[
            'id' => 'allocator', 
            'title' => 'Allocator', 
            'description' => 'can view/download the results and allocate Viewers to options',
        ],*/
    ];
    private $_adminRole = [
        'id' => 'admin', 
        'title' => 'Administrator', 
        'description' => 'has full control to do everything for a Choice and can give additional permissions to others',
    ];
    private $_viewRole = [
        'id' => 'viewer', 
        'title' => 'Viewer', 
        'description' => 'can view published options and make choices. This is the default \'student\' role, and everyone who is able to access the Choice will have this role.',
    ];


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
     * getAllRoles method
     * Returns the array of additional roles
     *
     * @return array $allRoles array of additional roles
     */
    public function getAllRoles() {
        $allRoles = $this->_nonAdminRoles;
        array_unshift($allRoles, $this->_viewRole);
        array_push($allRoles, $this->_adminRole);
        return $allRoles;
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
     * getChoicesUser method
     * Looks up the User's roles for a Choice and returns array of arrays
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param boolean $includeView Whether or not include 'view' as one of the roles
     * @return array $roles array of the User's roles with full role info (or empty array if not associated)
     */
    public function getChoicesUser($choiceId = null, $userId = null) {
        //If either choiceId or userId isn't set, return empty array (i.e. no result)
        if(!$choiceId || !$userId) {
            return [];
        }
        
        //Look up user's for this Choice in the ChoicesUsers table
        $choicesUsersQuery = $this->find('all', [
            'conditions' => ['choice_id' => $choiceId, 'user_id' => $userId],
        ]);
        
        $choicesUser = $choicesUsersQuery->first();

        return $choicesUser;
    }

    /**
     * getRoles method
     * Looks up the User's roles for a Choice and returns array of arrays
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param boolean $includeView Whether or not include 'view' as one of the roles
     * @return array $roles array of the User's roles with full role info (or empty array if not associated)
     */
    public function getRoles($choiceId = null, $userId = null, $includeView = false) {
        //If either choiceId or userId isn't set, return empty array (i.e. no role)
        if(!$choiceId || !$userId) {
            $roles = [];
        }
        
        $choicesUser = $this->getChoicesUser($choiceId, $userId);

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
                $roles[] = $this->_adminRole['id'];
            }
            else {
                foreach($this->_nonAdminRoles as $role) {
                    $roleId = $role['id'];
                    if($choicesUser->$roleId) {
                        $roles[] = $role['id'];
                    }
                }
            }
            
            //Anyone associated with a Choice, and without additional permissions, still has the view role
            if(empty($roles) && $includeView) { $roles[] = $this->_viewRole['id']; }
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
     * isViewer method
     * Checks whether a User is allowed to view a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @return boolean True if the User is allowed to view, false if not
     */
    public function isViewer($choiceId = null, $userId = null) {
        $choicesUser = $this->getChoicesUser($choiceId, $userId);
        
        return !empty($choicesUser);
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
        return $this->isRoles($choiceId, $userId, ['admin']);
    }

    /**
     * isAllocator method
     * Checks whether a User is an Allocator for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @return boolean True if the User is an Allocator, false if not
     */
    public function isAllocator($choiceId = null, $userId = null) {
        return $this->isRoles($choiceId, $userId, ['allocator']);
    }
    
    /**
     * isApprover method
     * Checks whether a User is an Approver for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @return boolean True if the User is an Approver, false if not
     */
    public function isApprover($choiceId = null, $userId = null) {
        return $this->isRoles($choiceId, $userId, ['approver']);
    }

    /**
     * isEditor method
     * Checks whether a User is an Editor for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @return boolean True if the User is an Editor, false if not
     */
    public function isEditor($choiceId = null, $userId = null) {
        return $this->isRoles($choiceId, $userId, ['editor']);
    }

    /**
     * isReviewer method
     * Checks whether a User is an Reviewer for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @return boolean True if the User is an Reviewer, false if not
     */
    public function isReviewer($choiceId = null, $userId = null) {
        return $this->isRoles($choiceId, $userId, ['reviewer']);
    }
    
    public function canViewResults($choiceId = null, $userId = null) {
        return $this->isRoles($choiceId, $userId, ['reviewer', 'allocator']);
    }

    /**
     * isRoles method
     * Checks whether a User has specific roles for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $role Role to check
     * @return boolean True if the User has the role, false if not
     */
    public function isRoles($choiceId = null, $userId = null, $roles = []) {
        //If either choiceId or userId isn't set, return false
        if(!$choiceId || !$userId || !$roles) {
            return false;
        }
        
        $userRoles = $this->getRoles($choiceId, $userId);

        //If user is admin then they have that role
        if(in_array('admin', $userRoles)) {
            return true;
        }
        
        //Otherwise, loop through the roles we are checking, and make sure the user has one of them
        foreach($roles as $role) {
            if(in_array($role, $userRoles) || in_array('admin', $userRoles)) {
                return true;
            }
        }
        
        return false;
    }
}
