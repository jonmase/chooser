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
 * @property \Cake\ORM\Association\HasMany $LtiUser
 * @property \Cake\ORM\Association\BelongsToMany $LtiUser
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

        $this->hasMany('LtiUserUsers', [
            'foreignKey' => 'user_id',
        ]);
        //Note: lots of extra assoications to add here - save a copy then rebake when tables are all present
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
            ->allowEmpty('email');

        $validator
            ->allowEmpty('fullname');

        $validator
            ->allowEmpty('firstname');

        $validator
            ->allowEmpty('lastname');

        return $validator;
    }
    
    public function process($tool = null) {
        if(!$tool) { return false; }
        
        $consumerKey = $tool->consumer->getKey();
        $contextId = $tool->context->getId();
        $ltiUserId = $tool->user->getId();
        
        //Set up the data for the ltiUserUsers table
        $ltiUserUsersData = $this->LtiUserUsers->newEntity([
            'lti_consumer_key' => $consumerKey,
            'lti_context_id' => $contextId,
            'lti_user_id' => $ltiUserId,
        ]);

        //Set up the basic LtiUserUsers query conditions
        $basicConditions = [
            'lti_consumer_key' => $consumerKey,
            'lti_user_id' => $ltiUserId,
            //'lti_context_id' => $contextId,   //Don't worry about context for initial user query, as User records will not be context specific
        ];
        
        //Get the LtiUserUsers record that match the consumer_key and lti_user_id
        $userQuery = $this->LtiUserUsers->find('all', [
            'conditions' => $basicConditions,
            'contain' => ['Users'],
        ]);
        //Use the first result, as it doesn't matter which context we get it from, the User record will be the same
        $savedUser = $userQuery->first();
        
        if(empty($savedUser)) {
            //No user matches this consumer_key and user_id, so create a new User
            $userData = $this->newEntity();
        }
        else {
            //User already exists, so get their ID and basic details
            $userId = $savedUser->user_id;
            $userData = $savedUser->user;

            //Is there an LtiUserUsers record for this consumer_key, user_id and context_id
            $contextUserQuery = $this->LtiUserUsers->find('all', [
                'conditions' => array_merge($basicConditions, ['lti_context_id' => $contextId]),
            ]);
            $savedContextUser = $contextUserQuery->first();
            
            //If there is already an LtiUserUsers record for this context_id, don't need to resave it
            if(!empty($savedContextUser)) {
                $ltiUserUsersData = null;
            }
        }

        //Add or Update the user details
        //Get username from displayid or lti_result_sourcedid
        if(isset($tool->user->displayid)) { $userData->username = $tool->user->displayid; }
        else { $userData->username = $tool->user->lti_result_sourcedid; }
        //Add the remaining user details if set
        if(isset($tool->user->email)) { $userData->email = $tool->user->email; }
        if(isset($tool->user->fullname)) { $userData->fullname = $tool->user->fullname; }
        if(isset($tool->user->firstname)) { $userData->firstname = $tool->user->firstname; }
        if(isset($tool->user->lastname)) { $userData->lastname = $tool->user->lastname; }
        
        //If the LtiUserUsers data is set, add it to the $userData object
        if($ltiUserUsersData) { $userData->lti_user_users = [$ltiUserUsersData]; }
        
        //pr($userData); //exit;    //Debugging
        if($this->save($userData)) {
            return true;
        }
        else {
            return false;
        }
    }
}
