<?php
namespace App\Test\TestCase\Model\Table;

use App\Model\Table\ExtraFieldOptionsTable;
use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;

/**
 * App\Model\Table\ExtraFieldOptionsTable Test Case
 */
class ExtraFieldOptionsTableTest extends TestCase
{

    /**
     * Test subject
     *
     * @var \App\Model\Table\ExtraFieldOptionsTable
     */
    public $ExtraFieldOptions;

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
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
        $config = TableRegistry::exists('ExtraFieldOptions') ? [] : ['className' => 'App\Model\Table\ExtraFieldOptionsTable'];
        $this->ExtraFieldOptions = TableRegistry::get('ExtraFieldOptions', $config);
    }

    /**
     * tearDown method
     *
     * @return void
     */
    public function tearDown()
    {
        unset($this->ExtraFieldOptions);

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
