<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * LtiUserFixture
 *
 */
class LtiUserFixture extends TestFixture
{

    /**
     * Table name
     *
     * @var string
     */
    public $table = 'lti_user';

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'consumer_key' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'context_id' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'user_id' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'lti_result_sourcedid' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'created' => ['type' => 'datetime', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        'updated' => ['type' => 'datetime', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['consumer_key', 'context_id', 'user_id'], 'length' => []],
            'lti_user_context_FK1' => ['type' => 'foreign', 'columns' => ['consumer_key', 'context_id'], 'references' => ['lti_context', '1' => ['consumer_key', 'context_id']], 'update' => 'restrict', 'delete' => 'restrict', 'length' => []],
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
            'consumer_key' => 'f8e3c52e-32c3-47e9-9193-519acb46e655',
            'context_id' => '3c5ce5ac-35d7-41ef-8b28-715b6281972a',
            'user_id' => 'c3d40e09-499c-4e51-8d47-699cac1f7963',
            'lti_result_sourcedid' => 'Lorem ipsum dolor sit amet',
            'created' => '2016-03-02 16:03:25',
            'updated' => '2016-03-02 16:03:25'
        ],
    ];
}
