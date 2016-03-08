<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ChoicesOptionsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ChoicesOptionsTable Test Case
 */
class ChoicesOptionsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ChoicesOptionsTable
     */
    public $ChoicesOptions;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.choices_options',
        'app.choices',
        'app.choices_lti_context',
        'app.lti_context',
        'app.lti_consumer',
        'app.lti_user',
        'app.lti_user_users',
        'app.users',
        'app.choices_options_users',
        'app.approvers',
        'app.options',
        'app.selections',
        'app.options_selections',
        'app.allocations',
        'app.shortlisted_options',
        'app.publishers',
        'app.editor_preferences',
        'app.profiles',
        'app.user_permissions',
        'app.choosing_instances',
        'app.editing_instances',
        'app.extra_fields',
        'app.extra_field_options',
        'app.rules',
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
        $config = TableRegistry::exists('ChoicesOptions') ? [] : ['className' => 'App\Model\Table\ChoicesOptionsTable'];
        $this->ChoicesOptions = TableRegistry::get('ChoicesOptions', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->ChoicesOptions);

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
