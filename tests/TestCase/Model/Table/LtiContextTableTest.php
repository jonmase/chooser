<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\LtiContextTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\LtiContextTable Test Case
 */
class LtiContextTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\LtiContextTable
     */
    public $LtiContext;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.lti_context',
        'app.contexts',
        'app.lti_contexts',
        'app.lti_resources'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('LtiContext') ? [] : ['className' => 'App\Model\Table\LtiContextTable'];
        $this->LtiContext = TableRegistry::get('LtiContext', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->LtiContext);

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
