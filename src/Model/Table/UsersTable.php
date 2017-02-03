<?php
namespace App\Model\Table;

use App\Model\Entity\User;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Users Model
 *
 * @property \Cake\ORM\Association\HasMany $ChoicesOptions (Approvers)
 * @property \Cake\ORM\Association\HasMany $ChoicesOptions (Publishers)
 * @property \Cake\ORM\Association\HasMany $ChoicesOptionsUsers
 * @property \Cake\ORM\Association\HasMany $ChoicesUsers
 * @property \Cake\ORM\Association\HasMany $EditorPreferences
 * @property \Cake\ORM\Association\HasMany $LtiUserUsers
 * @property \Cake\ORM\Association\HasMany $Selections
 * @property \Cake\ORM\Association\HasMany $ShortlistedOptions
 * @property \Cake\ORM\Association\HasOne $Profiles
 * //@property \Cake\ORM\Association\BelongsToMany $ChoicesOptions
 * @property \Cake\ORM\Association\BelongsToMany $Choices
 * //@property \Cake\ORM\Association\BelongsToMany $LtiUser
 */
class UsersTable extends Table
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

        $this->table('users');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->addBehavior('Timestamp');

        $this->hasMany('Approvers', [
            'className' => 'ChoicesOptions',
            'foreignKey' => 'approver',
        ]);
        $this->hasMany('Publishers', [
            'className' => 'ChoicesOptions',
            'foreignKey' => 'publisher',
        ]);
        $this->hasMany('ChoicesOptionsUsers', [
            'foreignKey' => 'user_id',
        ]);
        $this->hasMany('EditorPreferences', [
            'foreignKey' => 'user_id'
        ]);
        $this->hasMany('LtiUserUsers', [
            'foreignKey' => 'user_id'
        ]);
        $this->hasMany('Selections', [
            'foreignKey' => 'user_id'
        ]);
        $this->hasMany('ShortlistedOptions', [
            'foreignKey' => 'user_id'
        ]);
        $this->hasOne('Profiles', [
            'foreignKey' => 'user_id'
        ]);
        /*$this->belongsToMany('ChoicesOptions', [
            'foreignKey' => 'user_id',
            'targetForeignKey' => 'choices_option_id',
            'joinTable' => 'choices_options_users'
        ]);*/
        //Create belongsToMany assocation with Choices and hasMany association with ChoicesUsers
        $this->hasMany('ChoicesUsers', [
            'foreignKey' => 'user_id'
        ]);
        $this->belongsToMany('Choices', [
            'foreignKey' => 'user_id',
            'targetForeignKey' => 'choice_id',
            'joinTable' => 'choices_users',
            'through' => 'ChoicesUsers',
            'saveStrategy' => 'append', //Use append strategy, so links between a user and other choices are not removed when adding/updating a user->choice link
        ]);
        /*$this->belongsToMany('LtiUser', [
            'foreignKey' => 'user_id',
            'targetForeignKey' => 'lti_user_id',
            'joinTable' => 'lti_user_users'
        ]);*/
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
            ->requirePresence('username', 'create')
            ->notEmpty('username');

        $validator
            ->email('email')
            ->allowEmpty('email');

        $validator
            ->allowEmpty('fullname');

        $validator
            ->allowEmpty('firstname');

        $validator
            ->allowEmpty('lastname');

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
        $rules->add($rules->isUnique(['username']));
        $rules->add($rules->isUnique(['email']));
        return $rules;
    }
    
    /**
     * Processes the user data from an LTI Launch
     * 
     * @param $tool The LTI tool object, containing user and context information
     * @return boolean True or false, depending on whether save succeeded
     */
    public function register($tool = null) {
        if(!$tool) { return false; }
        
        $consumerKey = $tool->consumer->getKey();
        $contextId = $tool->context->getId();
        $ltiUserId = $tool->user->getId();
        
        //Get username from displayid or lti_result_sourcedid
        if(isset($tool->user->displayid)) { $username = $tool->user->displayid; }
        else { $username = $tool->user->lti_result_sourcedid; }
        
        //Get the user's email, if it's set in the LTI request
        if(isset($tool->user->email)) { 
            $userEmail = $tool->user->email; 
        }
        else {
            $userEmail = null;
        }
        
        //Set up the basic LtiUserUsers query conditions
        //Users are uniquely defined by the consumer_key and lti_user_id
        //A single consumer key should only be used for a single institution
        //A single institution can have multiple consumer keys, which will mean that the same lti_user_id represents a different user in Chooser
        $uniqueUserConditions = [
            'lti_consumer_key' => $consumerKey,
            'lti_user_id' => $ltiUserId,
        ];
        
        //Get the LtiUserUsers record that match the consumer_key and lti_user_id
        $ltiUserQuery = $this->LtiUserUsers->find('all', [
            'conditions' => $uniqueUserConditions,
            'contain' => ['Users'],
        ]);
        
        //If there is an LtiUserUsers record for this user, use this user
        $savedLtiUser = $ltiUserQuery->first(); //Use the first result, as it doesn't matter which context we get it from, the User record will be the same
        if(!empty($savedLtiUser)) {
            //Get user from LTI 
            $user = $savedLtiUser->user;
        }
        else {
            //Look for user matching username and, if set, email address in users table
            //This will happen if user has been given additional permissions in a choice before they have accessed Chooser
            //Users can be given additional permissions by username or by email, but whichever is used it will be put in the 'username' field of the Users table, so search this field for either username or email
            $userConditions = ['Users.username' => $username];
            if($userEmail && $userEmail != $username) { //If email is set, add this to the conditions
                $userConditions = ['OR' => [
                    $userConditions,
                    ['Users.username' => $userEmail]
                ]];
            }

            $userQuery = $this->LtiUserUsers->Users->find('all', [
                'conditions' => $userConditions
            ]);
            $savedUser = $userQuery->first();
            
            if(!empty($savedUser)) {
                //User appears in Users table, so use this user
                $user = $savedUser;
            }
            else {
                //User not in Users table, so create a new user entity
                $user = $this->newEntity();
            }
        }

        //Is there an LtiUserUsers record for this consumer_key, user_id and context_id
        $contextUserQuery = $this->LtiUserUsers->find('all', [
            'conditions' => array_merge($uniqueUserConditions, ['lti_context_id' => $contextId]),
        ]);
        $savedContextUser = $contextUserQuery->first();
        
        //If there is not already an LtiUserUsers record for this context_id, save it as an association to User
        if(empty($savedContextUser)) {
            //Set up the data for the ltiUserUsers table
            $user->lti_user_users = [
                $this->LtiUserUsers->newEntity([
                    'lti_consumer_key' => $consumerKey,
                    'lti_context_id' => $contextId,
                    'lti_user_id' => $ltiUserId,
                ])
            ];
        }

        //Add or Update the user details
        $user->username = $username;
        $user->email = $userEmail;
        if(isset($tool->user->fullname)) { $user->fullname = $tool->user->fullname; }
        if(isset($tool->user->firstname)) { $user->firstname = $tool->user->firstname; }
        if(isset($tool->user->lastname)) { $user->lastname = $tool->user->lastname; }
        
        //pr($user); exit;    //Debugging
        if($this->save($user)) {
            //Send back just the user record - used for logging in
            unset($user->lti_user_users);
            return $user;
        }
        else {
            return false;
        }
    }
    
    /**
     * findByUsernameThenEmail method
     * Looks for a user, firstly by the username, then by the email if not found
     * 
     * @param $searchValue The username/email to search on
     * @return App\Model\Entity\User $user User entity
     */
    public function findByUsernameThenEmail($searchValue) {
        if(!$searchValue) {
            return false;
        }
        
        $user = $this->findAllByUsername($searchValue);
        
        if($user->isEmpty()) {
            $user = $this->findByEmail($searchValue);
            if(!$user->isEmpty()) {
                $foundBy = 'email';
            }
        }
        else {
            $foundBy = 'username';
        }
        
        $user = $user->first();
        if(!empty($user)) {
            $user->foundBy = $foundBy;
        }
        
        return $user;
    }
    
    public function getForChoice($choiceId, $userId) {
        $sortField = 'username';
        $sortDirection = 'ASC';
        $usersQuery = $this->find('all', ['sort' => ['Users.' . $sortField => $sortDirection]]);
        $usersQuery->matching('ChoicesUsers', function ($q) use ($choiceId) {
            return $q->where(['ChoicesUsers.choice_id >=' => $choiceId]);
        });
        $users = $usersQuery->toArray();

        foreach($users as $index => &$user) {
            //Get roles from _matchingData, including view role
            $user->roles = $this->ChoicesUsers->processRoles($user->_matchingData['ChoicesUsers'], true);  
            unset($user->_matchingData);
            
            if($user->id === $userId) {
                $user->current = true;
            }
        }

        return $users;
    }
}
