<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\RulesRelatedOptionsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\RulesRelatedOptionsTable Test Case
 */
class RulesRelatedOptionsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\RulesRelatedOptionsTable
     */
    public $RulesRelatedOptions;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.rules_related_options',
        'app.choosing_instances',
        'app.options',
        'app.choices_options',
        'app.choices',
        'app.choices_lti_context',
        'app.lti_context',
        'app.lti_consumer',
        'app.lti_user',
        'app.lti_user_users',
        'app.users',
        'app.choices_options_users',
        'app.extra_fields',
        'app.extra_field_options',
        'app.rules',
        'app.student_preference_categories',
        'app.approvers',
        'app.approved_by',
        'app.publishers',
        'app.published_by',
        'app.editor_preferences',
        'app.profiles',
        'app.selections',
        'app.shortlisted_options',
        'app.user_permissions',
        'app.allocations',
        'app.options_selections',
        'app.editing_instances',
        'app.rules_related_options_a',
        'app.rules_related_options_b'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('RulesRelatedOptions') ? [] : ['className' => 'App\Model\Table\RulesRelatedOptionsTable'];
        $this->RulesRelatedOptions = TableRegistry::get('RulesRelatedOptions', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->RulesRelatedOptions);

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
