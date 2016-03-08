<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * RulesRelatedOptionsFixture
 *
 */
class RulesRelatedOptionsFixture extends TestFixture
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
        'option_a_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'option_b_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'created' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        'modified' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        '_indexes' => [
            'fk_rules_related_options_options1_idx' => ['type' => 'index', 'columns' => ['option_a_id'], 'length' => []],
            'fk_rules_related_options_options2_idx' => ['type' => 'index', 'columns' => ['option_b_id'], 'length' => []],
            'fk_rules_related_options_choosing_instances1_idx' => ['type' => 'index', 'columns' => ['choosing_instance_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id'], 'length' => []],
            'fk_rules_related_options_choosing_instances1' => ['type' => 'foreign', 'columns' => ['choosing_instance_id'], 'references' => ['choosing_instances', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_rules_related_options_options1' => ['type' => 'foreign', 'columns' => ['option_a_id'], 'references' => ['options', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_rules_related_options_options2' => ['type' => 'foreign', 'columns' => ['option_b_id'], 'references' => ['options', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
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
            'option_a_id' => 1,
            'option_b_id' => 1,
            'created' => '2016-03-08 15:28:05',
            'modified' => '2016-03-08 15:28:05'
        ],
    ];
}
