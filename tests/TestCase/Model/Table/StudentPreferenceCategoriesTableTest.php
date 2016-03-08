<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\StudentPreferenceCategoriesTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\StudentPreferenceCategoriesTable Test Case
 */
class StudentPreferenceCategoriesTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\StudentPreferenceCategoriesTable
     */
    public $StudentPreferenceCategories;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.student_preference_categories',
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
        'app.related_option_a',
        'app.related_option_b',
        'app.approved_by',
        'app.approvers',
        'app.published_by',
        'app.publishers',
        'app.allocations',
        'app.options_selections',
        'app.selections',
        'app.editor_preferences',
        'app.shortlisted_options',
        'app.profiles',
        'app.user_permissions',
        'app.extra_fields',
        'app.extra_field_options',
        'app.related_category_a',
        'app.related_category_b',
        'app.rules',
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
        $config = TableRegistry::exists('StudentPreferenceCategories') ? [] : ['className' => 'App\Model\Table\StudentPreferenceCategoriesTable'];
        $this->StudentPreferenceCategories = TableRegistry::get('StudentPreferenceCategories', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->StudentPreferenceCategories);

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
