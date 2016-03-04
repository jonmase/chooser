<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * LtiNonceFixture
 *
 */
class LtiNonceFixture extends TestFixture
{

    /**
     * Table name
     *
     * @var string
     */
    public $table = 'lti_nonce';

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'consumer_key' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'value' => ['type' => 'string', 'length' => 32, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'expires' => ['type' => 'datetime', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['consumer_key', 'value'], 'length' => []],
            'lti_nonce_consumer_FK1' => ['type' => 'foreign', 'columns' => ['consumer_key'], 'references' => ['lti_consumer', 'consumer_key'], 'update' => 'restrict', 'delete' => 'restrict', 'length' => []],
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
            'consumer_key' => '84ce5578-b55f-40bf-bc2f-f70e05e2d3b6',
            'value' => '5b0dba0a-a368-4011-8035-1a24f6c9ab55',
            'expires' => '2016-03-02 16:03:17'
        ],
    ];
}
