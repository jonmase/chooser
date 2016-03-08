<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\SelectionsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\SelectionsTable Test Case
 */
class SelectionsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\SelectionsTable
     */
    public $Selections;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.selections',
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
        'app.shortlisted_options',
        'app.editor_preferences',
        'app.profiles',
        'app.user_permissions',
        'app.extra_fields',
        'app.extra_field_options',
        'app.related_category_a',
        'app.related_category_b',
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
        $config = TableRegistry::exists('Selections') ? [] : ['className' => 'App\Model\Table\SelectionsTable'];
        $this->Selections = TableRegistry::get('Selections', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->Selections);

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
