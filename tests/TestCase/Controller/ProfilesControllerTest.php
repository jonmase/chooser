<?php
namespace App\Test\TestCase\Controller;

use App\Controller\ProfilesController;
use Cake\TestSuite\IntegrationTestCase;

/**
 * App\Controller\ProfilesController Test Case
 */
class ProfilesControllerTest extends IntegrationTestCase
{

    /**
     * Fixtures
     *
     * @var array
     */
    public $fixtures = [
        'app.profiles',
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
        'app.extra_field_options',
        'app.extra_fields',
        'app.choices_options_users',
        'app.student_preference_categories',
        'app.options_selections',
        'app.selections',
        'app.allocations',
        'app.editor_preferences',
        'app.related_category_a',
        'app.related_category_b',
        'app.rules_related_categories',
        'app.rules_related_options',
        'app.related_option_b',
        'app.shortlisted_options',
        'app.approved_by',
        'app.publishers',
        'app.published_by',
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
