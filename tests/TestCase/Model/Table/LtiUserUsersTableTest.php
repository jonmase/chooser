<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\LtiUserUsersTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\LtiUserUsersTable Test Case
 */
class LtiUserUsersTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\LtiUserUsersTable
     */
    public $LtiUserUsers;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.lti_user_users',
        'app.lti_user',
        'app.lti_context',
        'app.contexts',
        'app.lti_contexts',
        'app.lti_resources',
        'app.users'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('LtiUserUsers') ? [] : ['className' => 'App\Model\Table\LtiUserUsersTable'];
        $this->LtiUserUsers = TableRegistry::get('LtiUserUsers', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->LtiUserUsers);

        parent::tearDown();
    }

    /**
     * Test initialize method
     *
     * @return void
     */
    public function testInitialize()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test validationDefault method
     *
     * @return void
     */
    public function testValidationDefault()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test buildRules method
     *
     * @return void
     */
    public function testBuildRules()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
