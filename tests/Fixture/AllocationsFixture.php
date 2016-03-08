<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * AllocationsFixture
 *
 */
class AllocationsFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'autoIncrement' => true, 'precision' => null],
        'selection_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'choices_option_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'created' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        'modified' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        '_indexes' => [
            'fk_allocations_selections1_idx' => ['type' => 'index', 'columns' => ['selection_id'], 'length' => []],
            'fk_allocations_choices_options1_idx' => ['type' => 'index', 'columns' => ['choices_option_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id'], 'length' => []],
            'fk_allocations_choices_options1' => ['type' => 'foreign', 'columns' => ['choices_option_id'], 'references' => ['choices_options', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_allocations_selections1' => ['type' => 'foreign', 'columns' => ['selection_id'], 'references' => ['selections', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
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
            'selection_id' => 1,
            'choices_option_id' => 1,
            'created' => '2016-03-08 15:45:27',
            'modified' => '2016-03-08 15:45:27'
        ],
    ];
}
