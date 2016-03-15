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
        'app.options_selections',
        'app.selections',
        'app.allocations',
        'app.editor_preferences',
        'app.related_category_a',
        'app.related_category_b',
        'app.rules_related_categories',
        'app.rules_related_options',
        'app.related_option_a',
        'app.related_option_b',
        'app.shortlisted_options',
        'app.editing_instances',
        'app.user_permissions',
        'app.options',
        'app.approved_by',
        'app.approvers',
        'app.published_by',
        'app.publishers',
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
