<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * RulesRelatedCategoriesFixture
 *
 */
class RulesRelatedCategoriesFixture extends TestFixture
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
        'force' => ['type' => 'boolean', 'length' => null, 'null' => false, 'default' => '1', 'comment' => '', 'precision' => null],
        'hard' => ['type' => 'boolean', 'length' => null, 'null' => false, 'default' => '1', 'comment' => '', 'precision' => null],
        'extra_field_option_a_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'extra_field_option_b_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'created' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        'modified' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        '_indexes' => [
            'fk_rules_related_options_choosing_instances1_idx' => ['type' => 'index', 'columns' => ['choosing_instance_id'], 'length' => []],
            'fk_rules_related_categories_extra_field_options1_idx' => ['type' => 'index', 'columns' => ['extra_field_option_a_id'], 'length' => []],
            'fk_rules_related_categories_extra_field_options2_idx' => ['type' => 'index', 'columns' => ['extra_field_option_b_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id'], 'length' => []],
            'fk_rules_related_categories_extra_field_options1' => ['type' => 'foreign', 'columns' => ['extra_field_option_a_id'], 'references' => ['extra_field_options', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_rules_related_categories_extra_field_options2' => ['type' => 'foreign', 'columns' => ['extra_field_option_b_id'], 'references' => ['extra_field_options', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_rules_related_options_choosing_instances10' => ['type' => 'foreign', 'columns' => ['choosing_instance_id'], 'references' => ['choosing_instances', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
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
            'force' => 1,
            'hard' => 1,
            'extra_field_option_a_id' => 1,
            'extra_field_option_b_id' => 1,
            'created' => '2016-03-08 15:28:14',
            'modified' => '2016-03-08 15:28:14'
        ],
    ];
}
