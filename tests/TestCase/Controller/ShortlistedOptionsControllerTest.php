<?php
namespace App\Test\TestCase\Controller;

use App\Controller\ShortlistedOptionsController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\ShortlistedOptionsController Test Case
 */
class ShortlistedOptionsControllerTest extends IntegrationTestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.shortlisted_options',
        'app.users',
        'app.approvers',
        'app.choices',
        'app.choices_lti_context',
        'app.lti_context',
        'app.lti_consumer',
        'app.lti_user',
        'app.lti_user_users',
        'app.choices_options',
        'app.options',
        'app.related_option_a',
        'app.choosing_instances',
        'app.rules',
        'app.extra_fields',
        'app.choices_options_users',
        'app.extra_field_options',
        'app.related_category_a',
        'app.related_category_b',
        'app.student_preference_categories',
        'app.options_selections',
        'app.selections',
        'app.allocations',
        'app.editor_preferences',
        'app.rules_related_categories',
        'app.rules_related_options',
        'app.related_option_b',
        'app.approved_by',
        'app.publishers',
        'app.published_by',
        'app.profiles',
        'app.choices_users',
        'app.editing_instances'
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