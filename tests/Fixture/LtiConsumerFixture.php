<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * LtiConsumerFixture
 *
 */
class LtiConsumerFixture extends TestFixture
{

    /**
     * Table name
     *
     * @var string
     */
    public $table = 'lti_consumer';

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'consumer_key' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'name' => ['type' => 'string', 'length' => 45, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'secret' => ['type' => 'string', 'length' => 32, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'lti_version' => ['type' => 'string', 'length' => 12, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'consumer_name' => ['type' => 'string', 'length' => 255, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'consumer_version' => ['type' => 'string', 'length' => 255, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'consumer_guid' => ['type' => 'string', 'length' => 255, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'css_path' => ['type' => 'string', 'length' => 255, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'protected' => ['type' => 'boolean', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        'enabled' => ['type' => 'boolean', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        'enable_from' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        'enable_until' => ['type' => 'datetime', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        'last_access' => ['type' => 'date', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        'created' => ['type' => 'datetime', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        'updated' => ['type' => 'datetime', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['consumer_key'], 'length' => []],
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
            'consumer_key' => '5acf3269-b954-4bdc-abdc-fb7418a396f6',
            'name' => 'Lorem ipsum dolor sit amet',
            'secret' => 'Lorem ipsum dolor sit amet',
            'lti_version' => 'Lorem ipsu',
            'consumer_name' => 'Lorem ipsum dolor sit amet',
            'consumer_version' => 'Lorem ipsum dolor sit amet',
            'consumer_guid' => 'Lorem ipsum dolor sit amet',
            'css_path' => 'Lorem ipsum dolor sit amet',
            'protected' => 1,
            'enabled' => 1,
            'enable_from' => '2016-03-02 16:02:54',
            'enable_until' => '2016-03-02 16:02:54',
            'last_access' => '2016-03-02',
            'created' => '2016-03-02 16:02:54',
            'updated' => '2016-03-02 16:02:54'
        ],
    ];
}
