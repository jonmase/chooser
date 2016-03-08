<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * ChoicesOptionsUsersFixture
 *
 */
class ChoicesOptionsUsersFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'autoIncrement' => true, 'precision' => null],
        'choices_option_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'user_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'extra_field_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'editor' => ['type' => 'boolean', 'length' => null, 'null' => false, 'default' => '0', 'comment' => '', 'precision' => null],
        'visible_to_students' => ['type' => 'boolean', 'length' => null, 'null' => false, 'default' => '1', 'comment' => '', 'precision' => null],
        '_indexes' => [
            'fk_choices_options_profiles_choices_options1_idx' => ['type' => 'index', 'columns' => ['choices_option_id'], 'length' => []],
            'fk_choices_options_profiles_extra_fields1_idx' => ['type' => 'index', 'columns' => ['extra_field_id'], 'length' => []],
            'fk_choices_options_profiles_users1_idx' => ['type' => 'index', 'columns' => ['user_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id'], 'length' => []],
            'fk_choices_options_profiles_choices_options1' => ['type' => 'foreign', 'columns' => ['choices_option_id'], 'references' => ['choices_options', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_choices_options_profiles_extra_fields1' => ['type' => 'foreign', 'columns' => ['extra_field_id'], 'references' => ['extra_fields', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_choices_options_profiles_users1' => ['type' => 'foreign', 'columns' => ['user_id'], 'references' => ['users', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
        ],
        '_options' => [
            'engine' => 'InnoDB',
            'collation' => 'utf8_general_ci'
        ],
    ];
    // @codingStandardsIgnoreEnd

    /**
     * Records
     *
     * @var array
     */
    public $records = [
        [
            'id' => 1,
            'choices_option_id' => 1,
            'user_id' => 1,
            'extra_field_id' => 1,
            'editor' => 1,
            'visible_to_students' => 1
        ],
    ];
}
