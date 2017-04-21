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
    private $_nonAdminOrViewRoles = [
        [
            'id' => 'editor', 
            'title' => 'Editor', 
            'description' => 'can create and edit their own options, and edit their profile',
            //'description' => 'can create and edit their own options, edit their profile and see who has chosen their options',
        ],
        [
            'id' => 'approver', 
            'title' => 'Approver', 
            'description' => 'only relevant in Choices that include an approval step, Approvers can view and approve or reject options that have been published by editors',
        ],
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
     * Returns the array of roles
     *
     * @return array $allRoles array of roles
     */
    public function getAllRoles() {
        $allRoles = $this->getNonViewRoles();
        array_unshift($allRoles, $this->_viewRole);
        return $allRoles;
    }

    /**
     * getNonViewRoles method
     * Returns the array of roles, except view
     *
     * @return array $nonViewRoles array of roles, except view
     */
    public function getNonViewRoles() {
        $nonViewRoles = $this->_nonAdminOrViewRoles;
        array_push($nonViewRoles, $this->_adminRole);
        return $nonViewRoles;
    }

    /**
     * getChoicesUser method
     * Looks up the ChoicesUsers record for a specified choice and user
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @return array $choicesUser ChoicesUsers record for choice/user
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
     * getUserRoles method
     * Looks up the User's roles (both default ones based on LTI role and additional ones saved in ChoicesUsers table) for a Choice and returns array of role ids
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @return array $roles array of the User's roles with full role info (or empty array if no roles)
     */
    public function getUserRoles($choiceId = null, $userId = null, $ltiTool = null) {
        //If choiceId or both userId and ltiTool are't set, return empty array (i.e. no role)
        if(!$choiceId || (!$ltiTool && !$userId)) {
            return [];
        }
        
        $roles = [];

        //If user is staff or admin based on LTI role, get default instructor permissions
        if($this->isLTIStaffOrAdmin($ltiTool)) {
            $roles = $this->Choices->getInstructorDefaultRolesFromChoiceId($choiceId);
        }
        
        //Get additional roles from ChoicesUsers Table
        $additionalRoles = $this->getUserAdditionalRoles($choiceId, $userId);
        
        //Add the additional roles to the roles array
        foreach($additionalRoles as $additionalRole) {
            if(!in_array($additionalRole, $roles)) {
                $roles[] = $additionalRole;
            }
        }
        
        return $roles;
    }
    
    /**
     * getUserRolesWithInfo method
     * Looks up the User's roles (both default ones based on LTI role and additional ones saved in ChoicesUsers table) for a Choice and returns array of role ids
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @return array $rolesWithInfo array of the User's roles with full role info (or empty array if no roles)
     */
    public function getUserRolesWithInfo($choiceId = null, $userId = null, $ltiTool = null) {
        //If choiceId or both userId and ltiTool are't set, return empty array (i.e. no role)
        if(!$choiceId || (!$ltiTool && !$userId)) {
            return [];
        }
        
        //Get the role IDs
        $roleIds = $this->getUserRoles($choiceId, $userId, $ltiTool);

        //Get the role info for all the roles except view
        $roleInfo = $this->getNonViewRoles();
        
        $rolesWithInfo = [];
        
        //Loop through role info, checking whether user has this role, and, if so, adding this role to the rolesWithInfo array
        foreach($roleInfo as $role) {
            if(in_array($role['id'], $roleIds)) {
                $rolesWithInfo[] = $role;
            }
        }
        
        return $rolesWithInfo;
    }
    
    /**
     * getUserAdditionalRoles method
     * Looks up the User's additional roles (stored in ChoicesUsers table) for a Choice and returns array of role ids
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @return array $roles array of the User's role ids (or empty array if not associated)
     */
    public function getUserAdditionalRoles($choiceId = null, $userId = null) {
        //If either choiceId or userId isn't set, return empty array (i.e. no role)
        if(!$choiceId || !$userId) {
            $roles = [];
        }
        
        $choicesUser = $this->getChoicesUser($choiceId, $userId);

        $roles = $this->processRoles($choicesUser);

        return $roles;
    }
    
    /**
     * processRoles method
     * Takes a ChoicesUsers record and process the roles into an array of role ids
     *
     * @param array $choicesUser ChoicesUsers record
     * @return array $roles array of the User's role ids (or empty array if not associated)
     */
    function processRoles($choicesUser = null) {
        $roles = [];

        //If the user is not associated with this Choice, return empty array, i.e. no role
        if(!empty($choicesUser)) {
            //If admin, don't need to return any other roles for this user
            if($choicesUser->admin) {
                $roles[] = $this->_adminRole['id'];
            }
            else {
                foreach($this->_nonAdminOrViewRoles as $role) {
                    $roleId = $role['id'];
                    if($choicesUser->$roleId) {
                        $roles[] = $roleId;
                    }
                }
            }
            
            //Anyone associated with a Choice, and without additional permissions, still has the view role
            //if(empty($roles) && $includeView) { $roles[] = $this->_viewRole['id']; }
        }
        
        return $roles;
    }
    
    /**
     * isLTIStaffOrAdmin method
     * Checks whether a User has an LTI staff or admin role
     *
     * @param $ltiTool LTI tool object
     * @return boolean True if the User has an LTI staff or admin role, false if not
     */
    public function isLTIStaffOrAdmin($ltiTool = null) {
        if($ltiTool && ($ltiTool->user->isStaff() || $ltiTool->user->isAdmin())) {
            return true;
        }
        else {
            return false;
        }
    }
    
    /**
     * isMoreThanViewer method
     * Checks whether a User has roles other than view over a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @return boolean True if the User has additional roles, false if not
     */
    public function isMoreThanViewer($choiceId = null, $userId = null, $ltiTool = null) {
        $nonViewRoles = $this->getNonViewRoles();
        $nonViewRolesIds = [];
        foreach($nonViewRoles as $role) {
            $nonViewRolesIds[] = $role['id'];
        }
        //pr($nonViewRolesIds);
        return $this->isRoles($choiceId, $userId, $ltiTool, $nonViewRolesIds);
    }
    
    /**
     * isViewer method
     * Checks whether a User is allowed to view a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @return boolean True if the User is allowed to view, false if not
     */
    public function isViewer($choiceId = null, $userId = null, $userId = null) {
        //User will alawys be allowed to view choice - not having option to switch between and not passing choice ID in URLs
        return true;
    }

    /**
     * isAdmin method
     * Checks whether a User is an admin for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @return boolean True if the User is an admin, false if not
     */
    public function isAdmin($choiceId = null, $userId = null, $ltiTool = null) {
        return $this->isRoles($choiceId, $userId, $ltiTool, ['admin']);
    }

    /**
     * isAllocator method
     * Checks whether a User is an Allocator for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @return boolean True if the User is an Allocator, false if not
     */
    public function isAllocator($choiceId = null, $userId = null, $ltiTool = null) {
        return $this->isRoles($choiceId, $userId, $ltiTool, ['allocator']);
    }
    
    /**
     * isApprover method
     * Checks whether a User is an Approver for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @return boolean True if the User is an Approver, false if not
     */
    public function isApprover($choiceId = null, $userId = null, $ltiTool = null) {
        return $this->isRoles($choiceId, $userId, $ltiTool, ['approver']);
    }

    /**
     * isEditor method
     * Checks whether a User is an Editor for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @return boolean True if the User is an Editor, false if not
     */
    public function isEditor($choiceId = null, $userId = null, $ltiTool = null) {
        return $this->isRoles($choiceId, $userId, $ltiTool, ['editor']);
    }

    /**
     * isReviewer method
     * Checks whether a User is an Reviewer for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @return boolean True if the User is an Reviewer, false if not
     */
    public function isReviewer($choiceId = null, $userId = null, $ltiTool = null) {
        return $this->isRoles($choiceId, $userId, $ltiTool, ['reviewer']);
    }
    
    /**
     * canViewResults method
     * Checks whether a User has permission to view results (i.e. is reviewer or approver)
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @return boolean True if the User is an Reviewer, false if not
     */
    public function canViewResults($choiceId = null, $userId = null, $ltiTool = null) {
        return $this->isRoles($choiceId, $userId, $ltiTool, ['reviewer', 'allocator']);
    }

    /**
     * isRoles method
     * Checks whether a User has specific roles for a Choice
     *
     * @param $choiceId ID of the Choice
     * @param $userId ID of the User
     * @param $ltiTool LTI tool object
     * @param $role Role to check
     * @return boolean True if the User has the role, false if not
     */
    public function isRoles($choiceId = null, $userId = null, $ltiTool = null, $roles = []) {
        //If either choiceId or userId isn't set, return false
        if(!$choiceId || (!$userId && !$ltiTool) || !$roles) {
            return false;
        }
        
        $userRoles = $this->getUserRoles($choiceId, $userId, $ltiTool);

        //If user is admin then they have the necessary role
        if(in_array('admin', $userRoles)) {
            return true;
        }
        
        //Otherwise, loop through the roles we are checking, and make sure the user has one of them
        foreach($roles as $role) {
            if(in_array($role, $userRoles)) {
                return true;
            }
        }
        
        return false;
    }
}
