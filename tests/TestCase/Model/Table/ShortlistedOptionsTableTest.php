<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ShortlistedOptionsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ShortlistedOptionsTable Test Case
 */
class ShortlistedOptionsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ShortlistedOptionsTable
     */
    public $ShortlistedOptions;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.shortlisted_options',
        'app.users',
        'app.choices_options_users',
        'app.choices_options',
        'app.choices',
        'app.choices_lti_context',
        'app.lti_context',
        'app.lti_consumer',
        'app.lti_user',
        'app.lti_user_users',
        'app.choosing_instances',
        'app.rules',
        'app.extra_field_options',
        'app.extra_fields',
        'app.student_preference_categories',
        'app.related_category_a',
        'app.related_category_b',
        'app.rules_related_categories',
        'app.rules_related_options',
        'app.related_option_a',
        'app.related_option_b',
        'app.selections',
        'app.editing_instances',
        'app.user_permissions',
        'app.options',
        'app.approved_by',
        'app.approvers',
        'app.published_by',
        'app.publishers',
        'app.allocations',
        'app.options_selections',
        'app.editor_preferences',
        'app.profiles'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('ShortlistedOptions') ? [] : ['className' => 'App\Model\Table\ShortlistedOptionsTable'];
        $this->ShortlistedOptions = TableRegistry::get('ShortlistedOptions', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->ShortlistedOptions);

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
