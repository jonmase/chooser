<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * StudentPreferenceCategoriesFixture
 *
 */
class StudentPreferenceCategoriesFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'autoIncrement' => true, 'precision' => null],
        'choosing_instance_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'name' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'description' => ['type' => 'string', 'length' => 1000, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'type' => ['type' => 'string', 'length' => 45, 'null' => false, 'default' => 'rank', 'comment' => '', 'precision' => null, 'fixed' => null],
        'points' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'min' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'max' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'extra_field_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'extra_field_option_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'created' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        'modified' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        '_indexes' => [
            'fk_student_preference_categories_extra_fields1_idx' => ['type' => 'index', 'columns' => ['extra_field_id'], 'length' => []],
            'fk_student_preference_categories_choosing_instances1_idx' => ['type' => 'index', 'columns' => ['choosing_instance_id'], 'length' => []],
            'fk_student_preference_categories_extra_field_options1_idx' => ['type' => 'index', 'columns' => ['extra_field_option_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id'], 'length' => []],
            'fk_student_preference_categories_choosing_instances1' => ['type' => 'foreign', 'columns' => ['choosing_instance_id'], 'references' => ['choosing_instances', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_student_preference_categories_extra_field_options1' => ['type' => 'foreign', 'columns' => ['extra_field_option_id'], 'references' => ['extra_field_options', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_student_preference_categories_extra_fields1' => ['type' => 'foreign', 'columns' => ['extra_field_id'], 'references' => ['extra_fields', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
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
            'choosing_instance_id' => 1,
            'name' => 'Lorem ipsum dolor sit amet',
            'description' => 'Lorem ipsum dolor sit amet',
            'type' => 'Lorem ipsum dolor sit amet',
            'points' => 1,
            'min' => 1,
            'max' => 1,
            'extra_field_id' => 1,
            'extra_field_option_id' => 1,
            'created' => '2016-03-08 15:39:51',
            'modified' => '2016-03-08 15:39:51'
        ],
    ];
}
