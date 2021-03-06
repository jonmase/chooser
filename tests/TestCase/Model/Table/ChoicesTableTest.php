<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ChoicesTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ChoicesTable Test Case
 */
class ChoicesTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ChoicesTable
     */
    public $Choices;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.choices',
        'app.choosing_instances',
        'app.editing_instances',
        'app.extra_fields',
        'app.user_permissions',
        'app.lti_context',
        'app.lti_consumer',
        'app.lti_user',
        'app.lti_user_users',
        'app.users',
        'app.choices_lti_context',
        'app.options',
        'app.choices_options'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Choices') ? [] : ['className' => 'App\Model\Table\ChoicesTable'];
        $this->Choices = TableRegistry::get('Choices', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Choices);

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
