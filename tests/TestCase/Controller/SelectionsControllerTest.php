<?php
namespace App\Test\TestCase\Controller;

use App\Controller\SelectionsController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\SelectionsController Test Case
 */
class SelectionsControllerTest extends IntegrationTestCase
{

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
        'app.related_category_b',
        'app.rules',
        'app.student_preference_categories',
        'app.options_selections',
        'app.editor_preferences',
        'app.shortlisted_options',
        'app.profiles',
        'app.choices_users',
        'app.allocations',
        'app.related_option_a',
        'app.related_option_b',
        'app.editing_instances',
        'app.rules_related_categories',
        'app.rules_related_options'
    ];

    /**
     * Test index method
     *
     * @return void
     */
    public function testIndex()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test view method
     *
     * @return void
     */
    public function testView()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test add method
     *
     * @return void
     */
    public function testAdd()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test edit method
     *
     * @return void
     */
    public function testEdit()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }

    /**
     * Test delete method
     *
     * @return void
     */
    public function testDelete()
    {
        $this->markTestIncomplete('Not implemented yet.');
    }
}
