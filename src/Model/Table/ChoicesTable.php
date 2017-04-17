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
     * getDefaultRoles method
     *
     * @param int $choiceId The DB ID of the choice
     * @return array An array of the default instructor roles for the Choice
     */
    public function getInstructorDefaultRolesFromChoiceId($choiceId = null) {
        if(!$choiceId) {
            return [];  //Return empty array so that it doesn't cause error when iterated
        }
        
        $choice = $this->get($choiceId, ['fields' => 'instructor_default_roles']);

        return $this->splitInstructorDefaultRoles($choice->instructor_default_roles);
    }
        
    public function splitInstructorDefaultRoles($instructorDefaultRolesField) {
        if(!$instructorDefaultRolesField) {
            return [];  //Return empty array so that it doesn't cause error when iterated
        }
        
        //Explode the default roles string
        $defaultRolesArray = explode(',', $instructorDefaultRolesField);
        
        //Get all the roles
        $allRoles = $this->ChoicesUsers->getAllRoles();
        
        //Add all the roles from the split default roles string that match one of the roles
        $defaultRoles = [];
        foreach($allRoles as $role) {
            if(in_array($role['id'], $defaultRolesArray)) {
                 $defaultRoles[] = $role['id'];
            }
        }
        
        return $defaultRoles;
    }
        
    /**
     * getExtraFieldTypes method
     *
     * @param int $choiceId The DB ID of the choice
     * @return array
     */
    public function getExtraFieldTypes($choiceId = null) {
        if(!$choiceId) {
            return [];  //Return empty array so that it doesn't cause error when iterated
        }
        
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
        
        $isAdmin = in_array('admin', $userRoles);

        
        //Work out if there is an active editing instance
        $activeEditingInstance = $this->EditingInstances->getActive($choiceId);
        //pr($activeEditingInstance);
        //Set the labels for the editing settings, the description for Options and whether the options buttons are disabled
        //$optionsDescription = 'View and/or edit the options that will be made available to students.';
        $optionsDescription = '';
        $optionsEditButtonEnabled = false;
        $optionsViewButtonEnabled = false;
        
        //If editing instance has not been set up yet
        if(empty($activeEditingInstance)) {
            $editingSettingsViewLabel = 'Set Up Editing';
            
            //Only Admins can edit options until editing is set up
            if($isAdmin) {
                $optionsDescription .= 'Please set up editing to allow Editors to create/edit options';
                $optionsEditButtonEnabled = true;
                $optionsViewButtonEnabled = true;
            }
            else {
                $optionsDescription = 'Option editing is currently unavailable, as an administrator has not set it up yet';
            }
        }
        //Editing instance has been set up
        else {
            $editingSettingsViewLabel = 'Editing Settings';
            
            //If the deadline has not passed yet...
            if(!$activeEditingInstance->deadline['passed']) {
                //If it has not opened yet...
                if(!$activeEditingInstance->opens['passed']) {
                    //Only Admins can edit options until editing opens
                    if($isAdmin) {
                        $optionsEditButtonEnabled = true;
                        $optionsViewButtonEnabled = true;
                        $optionsDescription .= 'Editors will not be able to create/edit options until editing opens<br />';
                    }
                    
                    //Show the opening date
                    $optionsDescription .= '<strong>Editing Opens: </strong> ' . $activeEditingInstance->opens['formatted'] . '<br />';
                }
                //Editing has open, so enable both buttons
                else {
                    $optionsEditButtonEnabled = true;
                    $optionsViewButtonEnabled = true;
                }
                
                //Show the deadline
                $optionsDescription .= '<strong>Editing Deadline: </strong> ' . $activeEditingInstance->deadline['formatted'];
            }
            //If deadline has passed
            else {
                $optionsDescription .= 'The deadline for editing options has now passed';
                $optionsViewButtonEnabled = true;   //Options can still be viewed
                
                if(!$isAdmin) {
                    //If not admin, disable edit button, but still allow to view options
                    $optionsEditButtonEnabled = false;
                }
                else {
                    //Admins can still edit options
                    $optionsEditButtonEnabled = true;
                    $optionsDescription .= ', so Editors will no longer be able to create/edit options';
                }
            }
        }
                    
        //Work out if there is an active choosing instance
        $activeChoosingInstanceQuery = $this->ChoosingInstances->findByChoiceId($choiceId);
        $activeChoosingInstance = !$activeChoosingInstanceQuery->isEmpty();
                    
        //Set the labels for the choosing settings buttons
        if($activeChoosingInstance) {
            $choiceSettingsViewLabel = 'View/Edit';
            $choiceSettingsViewMenuLabel = 'Choosing Settings';
        }
        else {
            $choiceSettingsViewLabel = 'Set Up';
            $choiceSettingsViewMenuLabel = 'Set Up Choosing';
        }
        
        $sections = [
            [
                'title' => 'User Permissions',
                'description' => 'Change the permission settings and give users additional permissions',
                'icon' => 'lock_open',  //icon => 'verified_user',//icon => 'block',
                'actions' => [
                    [
                        'label' => 'Edit',
                        'url' => Router::url(['controller' => 'users', 'action' => 'index']),
                    ]
                ],
                'roles' => ['admin'],
            ],
            [
                'title' => 'Editing Setup',
                'description' => 'Define the fields that will appear on the form for creating/editing options and setup the process and deadlines for creating and editing options',
                'icon' => 'build',
                'actions' => [
                    [
                        'icon' => 'playlist_add',   //'icon' => 'input',//'icon' => 'format_list_bulleted',//icon' => 'reorder',
                        'label' => 'Options Form',
                        'menuLabel' => 'Options Form',
                        'url' => Router::url(['controller' => 'choices', 'action' => 'form']),
                    ],
                    [
                        'label' => $editingSettingsViewLabel,
                        'menuLabel' => $editingSettingsViewLabel,
                        'url' => Router::url(['controller' => 'editing_instances', 'action' => 'view']),
                    ],
                ],
                'roles' => ['admin'],
            ],
            /*[
                'title' => 'Notifications',
                'description' => '',
                'icon' => 'mail_outline',   //'icon' => 'announcement',//'icon' => 'priority_high',
                'actions' => [
                    [
                        'label' => 'Edit',
                    ]
                ],
                'roles' => ['admin'],
            ],*/
            /*[
                'title' => 'Profile',
                'description' => 'Edit your profile, which is the information that will be shown to students. This will be the same across all Choices where you offer options',
                'icon' => 'perm_identity',  //'icon' => 'account_circle',
                'actions' => [
                    [
                        'label' => 'Edit',
                        'url' => Router::url(['controller' => 'profiles', 'action' => 'view']),
                    ]
                ],
                'roles' => ['admin', 'editor'],
            ],*/
            [
                'title' => 'Options',
                'description' => $optionsDescription,
                'icon' => 'list',   //'icon' => 'view_list',//'icon' => 'format_list_numbered',
                'actions' => [
                    [
                        'disabled' => !$optionsViewButtonEnabled,
                        'label' => 'View All',
                        'menuLabel' => 'View All Options',
                        'url' => Router::url(['controller' => 'options', 'action' => 'view']),
                    ],
                    [
                        'disabled' => !$optionsEditButtonEnabled,
                        'icon' => 'edit',
                        'label' => 'Edit',
                        'menuLabel' => 'Edit Options',
                        'url' => Router::url(['controller' => 'options', 'action' => 'edit']),
                        'roles' => ['admin', 'editor'],
                    ],
                    /*[
                        'disabled' => $optionsButtonsDisabled,
                        'icon' => 'check',
                        'label' => 'Approve',
                        'menuLabel' => 'Approve Options',
                        'url' => Router::url(['controller' => 'options', 'action' => 'approve']),
                        'roles' => ['admin', 'approver'],
                    ]*/
                ],
                'roles' => ['admin', 'editor', 'approver', 'allocator', 'reviewer'],
            ],
            [
                'title' => 'Choosing Settings',
                'description' => 'Schedule the choice for students, set up rules and define other settings',
                'icon' => 'schedule',   //'icon' => 'timer',
                'actions' => [
                    [
                        'icon' => 'schedule',
                        'label' => $choiceSettingsViewLabel,
                        'menuLabel' => $choiceSettingsViewMenuLabel,
                        'url' => Router::url(['controller' => 'ChoosingInstances', 'action' => 'view']),
                    ]
                ],
                'roles' => ['admin'],
            ],
            [
                'title' => 'Results',
                'description' => 'View and download the results',
                'icon' => 'equalizer',//'icon' => 'show_chart',//'icon' => 'insert_chart',
                'actions' => [
                    [
                        'label' => 'View',
                        'url' => Router::url(['controller' => 'selections', 'action' => 'index']),
                    ],
                    [
                        'icon' => 'file_download',
                        'label' => 'Download by Student',
                        'menuLabel' => 'Download Student Results',
                        'url' => Router::url(['controller' => 'selections', 'action' => 'download', 'student']),
                    ],
                    [
                        'icon' => 'file_download',
                        'label' => 'Download by Option',
                        'menuLabel' => 'Download Option Results',
                        'url' => Router::url(['controller' => 'selections', 'action' => 'download', 'option']),
                    ]
                ],
                'roles' => ['admin', 'reviewer', 'allocator'],
            ],
            /*[
                'title' => 'Allocations',
                'description' => '',
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
            
            [
                'title' => 'Reset & Archive',
                'description' => 'Archive the results, reset the editing and choosing settings and optionally unpublish all of the options',
                'icon' => 'autorenew',
                'actions' => [
                    [
                        'icon' => 'autorenew',
                        'label' => 'Reset',
                        'menuLabel' => 'Reset Choice',
                        'url' => Router::url(['controller' => 'Choices', 'action' => 'reset']),
                    ],
                    /*[
                        'icon' => 'history',
                        'label' => 'View Archive',
                        'menuLabel' => 'Archived Choices',
                        'description' => '',
                        'url' => Router::url(['controller' => 'Choices', 'action' => 'archive']),
                    ]*/
                ],
                'roles' => ['admin'],
            ],
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
                                    break;
                                }
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
        //pr($userSections);

        return $userSections;
    }

    public function getDashboardSectionsForUser($choiceId = null, $userId = null, $ltiTool = null) {
        if(!$choiceId || (!$userId && !$ltiTool)) {
            return [];
        }
        
        $roles = $this->ChoicesUsers->getUserRoles($choiceId, $userId, $ltiTool);
        if(empty($roles)) {
            return [];
        }
        $sections = $this->getDashboardSections($choiceId, $roles);
        
        return $sections;
    }
}
