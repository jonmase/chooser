<?php
namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * LtiUserUsersFixture
 *
 */
class LtiUserUsersFixture extends TestFixture
{

    /**
     * Fields
     *
     * @var array
     */
    // @codingStandardsIgnoreStart
    public $fields = [
        'id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'autoIncrement' => true, 'precision' => null],
        'lti_user_consumer_key' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'lti_user_context_id' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'lti_user_user_id' => ['type' => 'string', 'length' => 255, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'fixed' => null],
        'user_id' => ['type' => 'integer', 'length' => 11, 'unsigned' => false, 'null' => false, 'default' => null, 'comment' => '', 'precision' => null, 'autoIncrement' => null],
        '_indexes' => [
            'fk_lti_user_users_lti_user1_idx' => ['type' => 'index', 'columns' => ['lti_user_consumer_key', 'lti_user_context_id', 'lti_user_user_id'], 'length' => []],
            'fk_lti_user_users_users1_idx' => ['type' => 'index', 'columns' => ['user_id'], 'length' => []],
        ],
        '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id'], 'length' => []],
            'fk_lti_user_users_lti_user1' => ['type' => 'foreign', 'columns' => ['lti_user_consumer_key', 'lti_user_context_id', 'lti_user_user_id'], 'references' => ['lti_user', '1' => ['consumer_key', 'context_id', 'user_id']], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
            'fk_lti_user_users_users1' => ['type' => 'foreign', 'columns' => ['user_id'], 'references' => ['users', 'id'], 'update' => 'noAction', 'delete' => 'noAction', 'length' => []],
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
            'lti_user_consumer_key' => 'Lorem ipsum dolor sit amet',
            'lti_user_context_id' => 'Lorem ipsum dolor sit amet',
            'lti_user_user_id' => 'Lorem ipsum dolor sit amet',
            'user_id' => 1
        ],
    ];
}
