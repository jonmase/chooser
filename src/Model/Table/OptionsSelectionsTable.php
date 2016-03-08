<?php
namespace App\Model\Table;

use App\Model\Entity\OptionsSelection;
use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * OptionsSelections Model
 *
 * @property \Cake\ORM\Association\BelongsTo $Selections
 * @property \Cake\ORM\Association\BelongsTo $ChoicesOptions
 * @property \Cake\ORM\Association\BelongsTo $StudentPreferenceCategories
 * @property \Cake\ORM\Association\HasMany $EditorPreferences
 */
class OptionsSelectionsTable extends Table
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

        $this->table('options_selections');
        $this->displayField('id');
        $this->primaryKey('id');

        $this->belongsTo('Selections', [
            'foreignKey' => 'selection_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('ChoicesOptions', [
            'foreignKey' => 'choices_option_id',
            'joinType' => 'INNER'
        ]);
        $this->belongsTo('StudentPreferenceCategories', [
            'foreignKey' => 'student_preference_category_id'
        ]);
        $this->hasMany('EditorPreferences', [
            'foreignKey' => 'options_selection_id'
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
            ->integer('rank')
            ->allowEmpty('rank');

        $validator
            ->integer('points')
            ->allowEmpty('points');

        $validator
            ->allowEmpty('comments');

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
        $rules->add($rules->existsIn(['selection_id'], 'Selections'));
        $rules->add($rules->existsIn(['choices_option_id'], 'ChoicesOptions'));
        $rules->add($rules->existsIn(['student_preference_category_id'], 'StudentPreferenceCategories'));
        return $rules;
    }
}
