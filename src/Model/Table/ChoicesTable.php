<?php
namespace App\Model\Table;

use App\Model\Entity\Choice;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\Routing\Router;

/**
 * Choices Model
 *
 * @property \Cake\ORM\Association\HasMany $ChoicesLtiContext
 * @property \Cake\ORM\Association\HasMany $ChoicesOptions
 * //@property \Cake\ORM\Association\HasMany $ChoicesUsers
 * @property \Cake\ORM\Association\HasMany $ChoosingInstances
 * @property \Cake\ORM\Association\HasMany $EditingInstances
 * @property \Cake\ORM\Association\HasMany $ExtraFields
 * @property \Cake\ORM\Association\BelongsToMany $Users
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

        $this->addBehavior('Timestamp');

        $this->hasMany('ChoicesLtiContext', [
            'foreignKey' => 'choice_id',
        ]);
        $this->hasMany('ChoicesOptions', [
            'foreignKey' => 'choice_id',
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
        //Create belongsToMany assocation with Users and hasMany association with ChoicesUsers
        $this->hasMany('ChoicesUsers', [
            'foreignKey' => 'choice_id'
        ]);
        $this->belongsToMany('Users', [
            'foreignKey' => 'choice_id',
            'targetForeignKey' => 'user_id',
            'joinTable' => 'choices_users',
            'through' => 'ChoicesUsers',
            'saveStrategy' => 'append', //Use append strategy, so links between a user and other choices are not removed when adding/updating a user->choice link
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

        //Do not require values for this, as will be set to 0 by default in DB
        $validator
            ->boolean('private');
            //->requirePresence('private', 'create')
            //->notEmpty('private');

        $validator
            ->allowEmpty('instructor_default_roles');

        //Do not require values for this, as will be set to 0 by default in DB
        $validator
            ->boolean('notify_additional_permissions');
            //->requirePresence('notify_additional_permissions', 'create')
            //->notEmpty('notify_additional_permissions');

        $validator
            ->allowEmpty('notify_additional_permissions_custom');

        return $validator;
    }
    
    /**
     * getChoices method
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
        
        //Get the Choices
        $choicesUsersQuery = $this->ChoicesUsers->find('all', [
            'conditions' => $conditions,
            'contain' => ['Choices'],
            'fields' => ['Choices.id', 'Choices.name'],
        ]);
        $choices = $choicesUsersQuery->all();

        return $choices;
    }
    
    /**
     * getChoiceWithProcessedExtraFields method
     *
     * @param int $choiceId The DB ID of the choice
     * @return array
     */
    public function getChoiceWithProcessedExtraFields($choiceId = null) {
        if(!$choiceId) {
            return [];
        }
        
        $choice = $this->get($choiceId, [
            'contain' => [
                'ExtraFields' => ['ExtraFieldOptions']
            ]
        ]);
        
        $choice['extra_field_ids'] = [];
        foreach($choice['extra_fields'] as $key => &$extra) {
            $extra = $this->ExtraFields->processExtraFieldsForView($extra);
            
            $choice['extra_field_ids'][$extra['id']] = $key;
        }
        
        return $choice;
    }
        
    /**
     * getExtraFieldTypes method
     *
     * @param int $choiceId The DB ID of the choice
     * @return array
     */
    public function getExtraFieldTypes($choiceId = null) {
        $extraTypes = $this->ChoicesOptions->Choices->ExtraFields->find('list', [
            'conditions' => ['choice_id' => $choiceId],
            'keyField' => 'name',
            'valueField' => 'type',
        ]);
        
        return $extraTypes->toArray();
    }
        
    public function getDashboardSections($choiceId = null, $userRoles = null) {
        if(!$choiceId || !$userRoles) {
            return [];
        }
        
        $sections = [
            [
                'title' => 'User Roles',
                'icon' => 'lock_open',  //icon => 'verified_user',//icon => 'block',
                'actions' => [
                    [
                        'label' => 'Edit',
                        'url' => Router::url(['controller' => 'choices', 'action' => 'roles', $choiceId]),
                    ]
                ],
                'roles' => ['admin'],
            ],
            [
                'title' => 'Options Form',
                'icon' => 'playlist_add',   //'icon' => 'input',//'icon' => 'format_list_bulleted',//icon' => 'reorder',
                'actions' => [
                    [
                        'label' => 'Edit',
                        'url' => Router::url(['controller' => 'choices', 'action' => 'form', $choiceId]),
                    ]
                ],
                'roles' => ['admin'],
            ],
            /*[
                'title' => 'Editing Schedules',
                'icon' => 'mode_edit',
                'actions' => [
                    [
                        'label' => 'Edit',
                    ],
                    [
                        'label' => 'New',
                    ]
                ],
                'roles' => ['admin'],
            ],*/
            /*[
                'title' => 'Notifications',
                'icon' => 'mail_outline',   //'icon' => 'announcement',//'icon' => 'priority_high',
                'actions' => [
                    [
                        'label' => 'Edit',
                    ]
                ],
                'roles' => ['admin'],
            ],*/
            [
                'title' => 'Profile',
                'icon' => 'perm_identity',  //'icon' => 'account_circle',
                'actions' => [
                    [
                        'label' => 'Edit',
                        'url' => Router::url(['controller' => 'profiles', 'action' => 'view', $choiceId]),
                    ]
                ],
                'roles' => ['admin', 'editor'],
            ],
            [
                'title' => 'Options',
                'icon' => 'list',   //'icon' => 'view_list',//'icon' => 'format_list_numbered',
                'actions' => [
                    [
                        'label' => 'Preview',
                        'url' => Router::url(['controller' => 'options', 'action' => 'view', $choiceId]),
                    ],
                    [
                        'label' => 'Edit',
                        'url' => Router::url(['controller' => 'options', 'action' => 'edit', $choiceId]),
                        'roles' => ['admin', 'editor'],
                    ],
                    [
                        'label' => 'Approve',
                        'url' => Router::url(['controller' => 'options', 'action' => 'approve', $choiceId]),
                        'roles' => ['admin', 'approver'],
                    ]
                ],
                'roles' => ['admin', 'editor', 'approver', 'allocator', 'reviewer'],
            ],
            /*[
                'title' => 'Choosing Schedules',
                'icon' => 'schedule',   //'icon' => 'timer',
                'actions' => [
                    [
                        'label' => 'Edit',
                    ],
                    [
                        'label' => 'New',
                    ]
                ],
                'roles' => ['admin'],
            ],*/
            /*[
                'title' => 'Results',
                'icon' => 'equalizer',//'icon' => 'show_chart',//'icon' => 'insert_chart',
                'actions' => [
                    [
                        'label' => 'View',
                    ],
                    [
                        'label' => 'Quick Download',
                    ]
                ],
                'roles' => ['admin', 'reviewer', 'allocator'],
            ],*/
            /*[
                'title' => 'Allocations',
                'icon' => 'compare_arrows',
                'actions' => [
                    [
                        'label' => 'View/Edit',
                    ],
                    [
                        'label' => 'Quick Download',
                    ]
                ],
                'roles' => ['admin', 'allocator'],
            ],*/
        ];
        
        $userSections = [];
        
        foreach($sections as $section) {
            $userSectionActions = [];
            foreach($section['roles'] as $sectionRole) {
                if(in_array($sectionRole, $userRoles)) {
                    foreach($section['actions'] as $action) {
                        //If roles are specified for the action, only add the actions for which the user has the correct roles
                        if(!empty($action['roles'])) {
                            foreach($action['roles'] as $actionRole) {
                                if(in_array($actionRole, $userRoles)) {
                                    $userSectionActions[] = $action;
                                }
                                break;
                            }
                        }
                        else {
                            $userSectionActions[] = $action;
                        }
                    }
                    $section['actions'] = $userSectionActions;
                    
                    $userSections[] = $section;
                    break;
                }
            }
        }

        return $userSections;
    }

    public function getDashboardSectionsFromId($choiceId = null, $userId = null) {
        if(!$choiceId || !$userId) {
            return [];
        }
        
        $roles = $this->ChoicesUsers->getRolesAsIDsArray($choiceId, $userId);
        if(empty($roles)) {
            return [];
        }
        $sections = $this->getDashboardSections($choiceId, $roles);
        
        return $sections;
    }
}
