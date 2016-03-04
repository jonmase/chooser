<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * ChoicesLtiContextFixture
 *
 */
class ChoicesLtiContextFixture extends TestFixture
{

    /**
     * Table name
     *
     * @var string
     */
    public $table = 'choices_lti_context';

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'autoIncrement' => true, 'precision' => null],
        'lti_consumer_key' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'lti_context_id' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'choice_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        '_indexes' => [
            'fk_lti_resources_choices1_idx' => ['type' => 'index', 'columns' => ['choice_id'], 'length' => []],
            'fk_lti_resources_lti_context1_idx' => ['type' => 'index', 'columns' => ['lti_consumer_key', 'lti_context_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id'], 'length' => []],
            'fk_lti_resources_choices1' => ['type' => 'foreign', 'columns' => ['choice_id'], 'references' => ['choices', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_lti_resources_lti_context1' => ['type' => 'foreign', 'columns' => ['lti_consumer_key', 'lti_context_id'], 'references' => ['lti_context', '1' => ['consumer_key', 'context_id']], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
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
            'lti_consumer_key' => 'Lorem ipsum dolor sit amet',
            'lti_context_id' => 'Lorem ipsum dolor sit amet',
            'choice_id' => 1
        ],
    ];
}
