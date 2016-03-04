<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\LtiUserTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\LtiUserTable Test Case
 */
class LtiUserTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\LtiUserTable
     */
    public $LtiUser;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
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
        $config = TableRegistry::exists('LtiUser') ? [] : ['className' => 'App\Model\Table\LtiUserTable'];
        $this->LtiUser = TableRegistry::get('LtiUser', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->LtiUser);

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
