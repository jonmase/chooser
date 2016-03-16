<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Datasource\ConnectionManager;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;
use Cake\Event\Event;

/**
 * LtiConsumer Controller
 *
 * @property \App\Model\Table\LtiConsumerTable $LtiConsumer
 */
class LtiConsumerController extends AppController
{
	public function beforeFilter(Event $event) {
        parent::beforeFilter($event);
		$this->Auth->allow('launch');
	}
	
    /**
     * Launch method
     *
     * Verifies LTI Launch, processes user information and then redirects appropriately
     *
     * @return \Cake\Network\Response|void Redirects to Choice view (if Choice is associated) or Choice link action
     * @throws \Cake\Network\Exception\ForbiddenException When not an LTI request, or LTI request fails.
     * @throws \Cake\Network\Exception\InternalErrorException When user cannot be saved.
     * @throws \Cake\Network\Exception\ForbiddenException When choice is not found and user does not have permission to configure it.
     */
    public function launch() {
        $this->autoRender = false;
        if(isset($_REQUEST['lti_message_type']) && isset($_REQUEST['oauth_consumer_key'])) {	//Is this an LTI request
            //lis_result_sourcedid is not sent by WebLearn, but is required for the LTI_Tool_Provider to save the user
            //Use the lis_person_sourcedid as the lis_result_sourcedid
            if(!isset($_POST['lis_result_sourcedid']) && isset($_POST['lis_person_sourcedid'])) {
                $_POST['lis_result_sourcedid'] = $_POST['lis_person_sourcedid'];
            }
			require_once(ROOT . DS . 'vendor' . DS  . 'adurolms' . DS  . 'lti-tool-provider' . DS . 'LTI_Tool_Provider.php');	//Load the LTI class
            
            //Connect to the database using the LTI data connector (not the Cake way!)
            //TODO: Could we do this in a more Cakey way?
            $dbconfig = ConnectionManager::get('default')->config();    //Get the database config using Cake ConnectionManager
            mysql_connect($dbconfig['host'], $dbconfig['username'], $dbconfig['password']);
            mysql_select_db($dbconfig['database']);
            $db_connector = \LTI_Data_Connector::getDataConnector('', 'MySQL');
            
            //Verify the launch
            //This calls the onLaunch method in the LTIToolProviderComponent, which just sets ltilaunch = true
            //Normally would do the LTI launch processing there, but that has to be a static function
            //Therefore, we will do all the processing from here, so we check for ltilaunch below then do the processing
            $tool = new \LTI_Tool_Provider('App\Controller\Component\LTIToolProviderComponent::onLaunch', $db_connector);
            $tool->execute();
            
            //Check that we have gone to the LTIToolProviderComponent::onLaunch method
            if($tool->ltilaunch) {
                //Add Sakai display ID to user data so it can be used as username
                if(isset($_POST['ext_sakai_provider_displayid']) && !isset($tool->user->displayid)) {
                    $tool->user->displayid = $_POST['ext_sakai_provider_displayid'];
                }
                
                //Add the tool to the session
                $session = $this->request->session();
                $session->write('tool', $tool);
                
                //Register the user
                if($user = $this->LtiConsumer->LtiContext->LtiUser->LtiUserUsers->Users->register($tool)) {
                    //Log the user in
                    $this->Auth->setUser($user->toArray());
                    
                    //Look up whether there is a Choice already associated with this link
                    $choiceContext = $this->LtiConsumer->LtiContext->ChoicesLtiContext->getContextChoice($tool);
                    
                    $staffOrAdmin = $tool->user->isStaff() || $tool->user->isAdmin();
                    
                    //If there is an associated Choice, go to it
                    if(!empty($choiceContext)) {
                        if($staffOrAdmin) {
                            $this->redirect(['controller' => 'choices', 'action' => 'manage', $choiceContext->choice_id]);
                        }
                        else {
                            $this->redirect(['controller' => 'choices', 'action' => 'view', $choiceContext->choice_id]);
                        }
                    }
                    //If there is no associated Choice, and user is Staff (i.e. Instructor) or Admin, allow them to create/associate a Choice
                    else if($staffOrAdmin ) {
                        $this->redirect(['controller' => 'choices', 'action' => 'add']);
                    }
                    //Otherwise, there is no associated Choice, and user is Learner, so throw error, as link has not been configured
                    else {
                        throw new ForbiddenException(__('There is no Choice associated with this link.'));
                    }
               }
                else {
                    throw new InternalErrorException(__('User details could not be saved.'));
                }
            }
            else {
                throw new ForbiddenException(__('Failed LTI Launch.'));
            }
        }
        else {
            throw new ForbiddenException(__('LTI Launch Required.'));
        }
    }
}
