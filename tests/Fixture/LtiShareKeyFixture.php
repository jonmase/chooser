<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * LtiShareKeyFixture
 *
 */
class LtiShareKeyFixture extends TestFixture
{

    /**
     * Table name
     *
     * @var string
     */
    public $table = 'lti_share_key';

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'share_key_id' => ['type' => 'string', 'length' => 32, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'primary_consumer_key' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'primary_context_id' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'auto_approve' => ['type' => 'boolean', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        'expires' => ['type' => 'datetime', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        '_indexes' => [
            'lti_share_key_context_FK1' => ['type' => 'index', 'columns' => ['primary_consumer_key', 'primary_context_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['share_key_id'], 'length' => []],
            'lti_share_key_context_FK1' => ['type' => 'foreign', 'columns' => ['primary_consumer_key', 'primary_context_id'], 'references' => ['lti_context', '1' => ['consumer_key', 'context_id']], 'update' => 'restrict', 'delete' => 'restrict', 'length' => []],
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
            'share_key_id' => 'e0ad2ba3-8730-462b-a524-3e8ed6cea43c',
            'primary_consumer_key' => 'Lorem ipsum dolor sit amet',
            'primary_context_id' => 'Lorem ipsum dolor sit amet',
            'auto_approve' => 1,
            'expires' => '2016-03-02 16:03:21'
        ],
    ];
}
