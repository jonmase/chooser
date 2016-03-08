<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ExtraFieldsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ExtraFieldsTable Test Case
 */
class ExtraFieldsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ExtraFieldsTable
     */
    public $ExtraFields;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.extra_fields',
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
        'app.editing_instances',
        'app.extra_field_options',
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
        $config = TableRegistry::exists('ExtraFields') ? [] : ['className' => 'App\Model\Table\ExtraFieldsTable'];
        $this->ExtraFields = TableRegistry::get('ExtraFields', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->ExtraFields);

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
