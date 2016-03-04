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
 * @property \Cake\ORM\Association\BelongsToMany $LtiContext
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

        $this->hasMany('LtiContext', [
            'foreignKey' => 'choice_id',
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
}
