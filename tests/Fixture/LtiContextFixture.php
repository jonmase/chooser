<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * LtiContextFixture
 *
 */
class LtiContextFixture extends TestFixture
{

    /**
     * Table name
     *
     * @var string
     */
    public $table = 'lti_context';

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'consumer_key' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'context_id' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'lti_context_id' => ['type' => 'string', 'length' => 255, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'lti_resource_id' => ['type' => 'string', 'length' => 255, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'title' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'settings' => ['type' => 'text', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        'primary_consumer_key' => ['type' => 'string', 'length' => 255, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'primary_context_id' => ['type' => 'string', 'length' => 255, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'share_approved' => ['type' => 'boolean', 'length' => null, 'null' => true, 'default' => null, 'comment' => '', 'precision' => null],
        'created' => ['type' => 'datetime', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        'updated' => ['type' => 'datetime', 'length' => null, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null],
        '_indexes' => [
            'lti_context_context_FK1' => ['type' => 'index', 'columns' => ['primary_consumer_key', 'primary_context_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['consumer_key', 'context_id'], 'length' => []],
            'lti_context_consumer_FK1' => ['type' => 'foreign', 'columns' => ['consumer_key'], 'references' => ['lti_consumer', 'consumer_key'], 'update' => 'restrict', 'delete' => 'restrict', 'length' => []],
            'lti_context_context_FK1' => ['type' => 'foreign', 'columns' => ['primary_consumer_key', 'primary_context_id'], 'references' => ['lti_context', '1' => ['consumer_key', 'context_id']], 'update' => 'restrict', 'delete' => 'restrict', 'length' => []],
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
            'consumer_key' => 'e2cd03ae-be85-4dae-8c94-5f9505d095d3',
            'context_id' => 'fc3f46c3-efdb-4cc5-80c8-1509cbd15acc',
            'lti_context_id' => 'Lorem ipsum dolor sit amet',
            'lti_resource_id' => 'Lorem ipsum dolor sit amet',
            'title' => 'Lorem ipsum dolor sit amet',
            'settings' => 'Lorem ipsum dolor sit amet, aliquet feugiat. Convallis morbi fringilla gravida, phasellus feugiat dapibus velit nunc, pulvinar eget sollicitudin venenatis cum nullam, vivamus ut a sed, mollitia lectus. Nulla vestibulum massa neque ut et, id hendrerit sit, feugiat in taciti enim proin nibh, tempor dignissim, rhoncus duis vestibulum nunc mattis convallis.',
            'primary_consumer_key' => 'Lorem ipsum dolor sit amet',
            'primary_context_id' => 'Lorem ipsum dolor sit amet',
            'share_approved' => 1,
            'created' => '2016-03-02 16:03:06',
            'updated' => '2016-03-02 16:03:06'
        ],
    ];
}
