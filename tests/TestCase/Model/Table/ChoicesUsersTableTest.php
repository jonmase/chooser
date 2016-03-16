<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ChoicesUsersTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ChoicesUsersTable Test Case
 */
class ChoicesUsersTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ChoicesUsersTable
     */
    public $ChoicesUsers;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.choices_users',
        'app.choices',
        'app.choices_lti_context',
        'app.lti_context',
        'app.lti_consumer',
        'app.lti_user',
        'app.lti_user_users',
        'app.users',
        'app.approvers',
        'app.options',
        'app.choices_options',
        'app.approved_by',
        'app.publishers',
        'app.published_by',
        'app.choices_options_users',
        'app.extra_fields',
        'app.extra_field_options',
        'app.related_category_a',
        'app.choosing_instances',
        'app.rules',
        'app.rules_related_categories',
        'app.related_category_b',
        'app.student_preference_categories',
        'app.options_selections',
        'app.selections',
        'app.allocations',
        'app.editor_preferences',
        'app.rules_related_options',
        'app.related_option_a',
        'app.related_option_b',
        'app.shortlisted_options',
        'app.profiles',
        'app.editing_instances'
    ];

    /**
     * setUp method
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
        $config = TableRegistry::exists('ChoicesUsers') ? [] : ['className' => 'App\Model\Table\ChoicesUsersTable'];
        $this->ChoicesUsers = TableRegistry::get('ChoicesUsers', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->ChoicesUsers);

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
