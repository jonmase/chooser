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
}
