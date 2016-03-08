<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ChoosingInstancesTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ChoosingInstancesTable Test Case
 */
class ChoosingInstancesTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ChoosingInstancesTable
     */
    public $ChoosingInstances;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.choosing_instances',
        'app.choices',
        'app.choices_lti_context',
        'app.lti_context',
        'app.lti_consumer',
        'app.lti_user',
        'app.lti_user_users',
        'app.users',
        'app.choices_options_users',
        'app.choices_options',
        'app.options',
        'app.rules_related_options_a',
        'app.rules_related_options_b',
        'app.approved_by',
        'app.approvers',
        'app.published_by',
        'app.publishers',
        'app.allocations',
        'app.options_selections',
        'app.shortlisted_options',
        'app.editor_preferences',
        'app.profiles',
        'app.selections',
        'app.user_permissions',
        'app.extra_fields',
        'app.extra_field_options',
        'app.rules',
        'app.student_preference_categories',
        'app.editing_instances',
        'app.rules_related_categories',
        'app.rules_related_options'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('ChoosingInstances') ? [] : ['className' => 'App\Model\Table\ChoosingInstancesTable'];
        $this->ChoosingInstances = TableRegistry::get('ChoosingInstances', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->ChoosingInstances);

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
