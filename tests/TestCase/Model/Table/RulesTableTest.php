<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\RulesTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\RulesTable Test Case
 */
class RulesTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\RulesTable
     */
    public $Rules;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.rules',
        'app.choosing_instances',
        'app.extra_field_options',
        'app.extra_fields',
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
        'app.editing_instances',
        'app.student_preference_categories'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('Rules') ? [] : ['className' => 'App\Model\Table\RulesTable'];
        $this->Rules = TableRegistry::get('Rules', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Rules);

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
