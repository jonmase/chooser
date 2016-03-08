<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * ShortlistedOptionsFixture
 *
 */
class ShortlistedOptionsFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'autoIncrement' => true, 'precision' => null],
        'user_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'choosing_instance_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'choices_option_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'created' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        'modified' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        '_indexes' => [
            'fk_shortlisted_options_choosing_instances1_idx' => ['type' => 'index', 'columns' => ['choosing_instance_id'], 'length' => []],
            'fk_shortlisted_options_choices_options1_idx' => ['type' => 'index', 'columns' => ['choices_option_id'], 'length' => []],
            'fk_shortlisted_options_users1_idx' => ['type' => 'index', 'columns' => ['user_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id'], 'length' => []],
            'fk_shortlisted_options_choices_options1' => ['type' => 'foreign', 'columns' => ['choices_option_id'], 'references' => ['choices_options', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_shortlisted_options_choosing_instances1' => ['type' => 'foreign', 'columns' => ['choosing_instance_id'], 'references' => ['choosing_instances', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_shortlisted_options_users1' => ['type' => 'foreign', 'columns' => ['user_id'], 'references' => ['users', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
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
            'user_id' => 1,
            'choosing_instance_id' => 1,
            'choices_option_id' => 1,
            'created' => '2016-03-08 15:38:22',
            'modified' => '2016-03-08 15:38:22'
        ],
    ];
}
