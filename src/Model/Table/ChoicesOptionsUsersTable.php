<?php
namespace App\Model\Table;

use App\Model\Entity\ChoicesOptionsUser;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * ChoicesOptionsUsers Model
 *
 * @property \Cake\ORM\Association\BelongsTo $ChoicesOptions
 * @property \Cake\ORM\Association\BelongsTo $Users
 * @property \Cake\ORM\Association\BelongsTo $ExtraFields
 */
class ChoicesOptionsUsersTable extends Table
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

        $this->table('choices_options_users');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->belongsTo('ChoicesOptions', [
            'foreignKey' => 'choices_option_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('Users', [
            'foreignKey' => 'user_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('ExtraFields', [
            'foreignKey' => 'extra_field_id',
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

        $validator
            ->boolean('editor')
            ->requirePresence('editor', 'create')
            ->notEmpty('editor');

        $validator
            ->boolean('visible_to_students')
            ->requirePresence('visible_to_students', 'create')
            ->notEmpty('visible_to_students');

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
        $rules->add($rules->existsIn(['choices_option_id'], 'ChoicesOptions'));
        $rules->add($rules->existsIn(['user_id'], 'Users'));
        $rules->add($rules->existsIn(['extra_field_id'], 'ExtraFields'));
        return $rules;
    }
}
