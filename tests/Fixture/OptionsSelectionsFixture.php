<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * OptionsSelectionsFixture
 *
 */
class OptionsSelectionsFixture extends TestFixture
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
        'student_preference_category_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'rank' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'points' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        'comments' => ['type' => 'text', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        '_indexes' => [
            'fk_options_selections_selections1_idx' => ['type' => 'index', 'columns' => ['selection_id'], 'length' => []],
            'fk_options_selections_choices_options1_idx' => ['type' => 'index', 'columns' => ['choices_option_id'], 'length' => []],
            'fk_options_selections_student_preference_categories1_idx' => ['type' => 'index', 'columns' => ['student_preference_category_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id'], 'length' => []],
            'fk_options_selections_choices_options1' => ['type' => 'foreign', 'columns' => ['choices_option_id'], 'references' => ['choices_options', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_options_selections_selections1' => ['type' => 'foreign', 'columns' => ['selection_id'], 'references' => ['selections', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_options_selections_student_preference_categories1' => ['type' => 'foreign', 'columns' => ['student_preference_category_id'], 'references' => ['student_preference_categories', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
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
            'student_preference_category_id' => 1,
            'rank' => 1,
            'points' => 1,
            'comments' => 'Lorem ipsum dolor sit amet, aliquet feugiat. Convallis morbi fringilla gravida, phasellus feugiat dapibus velit nunc, pulvinar eget sollicitudin venenatis cum nullam, vivamus ut a sed, mollitia lectus. Nulla vestibulum massa neque ut et, id hendrerit sit, feugiat in taciti enim proin nibh, tempor dignissim, rhoncus duis vestibulum nunc mattis convallis.'
        ],
    ];
}
