<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\LtiConsumerTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\LtiConsumerTable Test Case
 */
class LtiConsumerTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\LtiConsumerTable
     */
    public $LtiConsumer;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.lti_consumer'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('LtiConsumer') ? [] : ['className' => 'App\Model\Table\LtiConsumerTable'];
        $this->LtiConsumer = TableRegistry::get('LtiConsumer', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->LtiConsumer);

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
}
