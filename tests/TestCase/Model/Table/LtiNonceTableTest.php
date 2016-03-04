<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\LtiNonceTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\LtiNonceTable Test Case
 */
class LtiNonceTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\LtiNonceTable
     */
    public $LtiNonce;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.lti_nonce'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('LtiNonce') ? [] : ['className' => 'App\Model\Table\LtiNonceTable'];
        $this->LtiNonce = TableRegistry::get('LtiNonce', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->LtiNonce);

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
