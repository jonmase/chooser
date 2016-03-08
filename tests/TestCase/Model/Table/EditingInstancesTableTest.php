<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\EditingInstancesTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\EditingInstancesTable Test Case
 */
class EditingInstancesTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\EditingInstancesTable
     */
    public $EditingInstances;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.editing_instances',
        'app.choices',
        'app.choices_lti_context',
        'app.lti_context',
        'app.lti_consumer',
        'app.lti_user',
        'app.lti_user_users',
        'app.users',
        'app.choices_options_users',
        'app.approvers',
        'app.publishers',
        'app.editor_preferences',
        'app.profiles',
        'app.selections',
        'app.shortlisted_options',
        'app.user_permissions',
        'app.choices_options',
        'app.choosing_instances',
        'app.extra_fields'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('EditingInstances') ? [] : ['className' => 'App\Model\Table\EditingInstancesTable'];
        $this->EditingInstances = TableRegistry::get('EditingInstances', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->EditingInstances);

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
