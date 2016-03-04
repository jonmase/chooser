<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\LtiShareKeyTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\LtiShareKeyTable Test Case
 */
class LtiShareKeyTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\LtiShareKeyTable
     */
    public $LtiShareKey;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.lti_share_key',
        'app.share_keys',
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
        $config = TableRegistry::exists('LtiShareKey') ? [] : ['className' => 'App\Model\Table\LtiShareKeyTable'];
        $this->LtiShareKey = TableRegistry::get('LtiShareKey', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->LtiShareKey);

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
