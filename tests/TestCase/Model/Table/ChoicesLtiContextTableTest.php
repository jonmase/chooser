<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ChoicesLtiContextTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ChoicesLtiContextTable Test Case
 */
class ChoicesLtiContextTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ChoicesLtiContextTable
     */
    public $ChoicesLtiContext;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.choices_lti_context',
        'app.lti_context',
        'app.lti_consumer',
        'app.lti_user',
        'app.lti_user_users',
        'app.users',
        'app.choices'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('ChoicesLtiContext') ? [] : ['className' => 'App\Model\Table\ChoicesLtiContextTable'];
        $this->ChoicesLtiContext = TableRegistry::get('ChoicesLtiContext', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->ChoicesLtiContext);

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
