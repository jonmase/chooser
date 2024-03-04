<?php
namespace App\Controller;

use App\Controller\AppController;
use App\Controller\Entity;
use Cake\Datasource\ConnectionManager;
use Cake\Network\Exception\ForbiddenException;
use Cake\Network\Exception\InternalErrorException;
use Cake\Event\Event;
use Cake\Log\Log;

/**
 * LtiConsumer Controller
 *
 * @property \App\Model\Table\LtiConsumerTable $LtiConsumer
 */
class LtiConsumerController extends AppController
{
    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * e.g. `$this->loadComponent('Security');`
     *
     * @return void
     */
    public function initialize()
    {
        parent::initialize();

        $this->loadComponent('Redirection');
    }

	public function beforeFilter(Event $event) {
        parent::beforeFilter($event);
		$this->Auth->allow('launch');
	}
	
    /**
     * Launch method
     *
     * Verifies LTI Launch, processes user information and then redirects appropriately
     *
     * @return \Cake\Network\Response|void Redirects to Choice view (if Choice is linked) or Choice link action
     * @throws \Cake\Network\Exception\ForbiddenException When not an LTI request, LTI request fails, or no choice and user does not have config permissions.
     * @throws \Cake\Network\Exception\InternalErrorException When user cannot be saved.
     * @throws \Cake\Datasource\Exception\MethodNotAllowedException When invalid method is used.
     */
    public function launch() {
        $this->request->allowMethod(['post']);
        $this->autoRender = false;
        if(isset($_REQUEST['lti_message_type']) && isset($_REQUEST['oauth_consumer_key'])) {	//Is this an LTI request
            //lis_result_sourcedid is not sent by Canvas, but is required for the LTI_Tool_Provider to save the user
            //Use the lis_person_sourcedid as the lis_result_sourcedid
            if(!isset($_POST['lis_result_sourcedid']) && isset($_POST['lis_person_sourcedid'])) {
                $_POST['lis_result_sourcedid'] = $_POST['lis_person_sourcedid'];
            }
			//require_once(ROOT . DS . 'vendor' . DS  . 'adurolms' . DS  . 'lti-tool-provider' . DS . 'LTI_Tool_Provider.php');	//Load the LTI class
			require_once(ROOT . DS . 'vendor' . DS  . 'lti-tool-provider' . DS . 'LTI_Tool_Provider.php');	//Load the LTI class
            
            //Connect to the database using the LTI data connector (not the Cake way!)
            //TODO: Could we do this in a more Cakey way?
			//JonM 14/6/21: Obsolete MySQL connector code commented out
            //$dbconfig = ConnectionManager::get('default')->config();    //Get the database config using Cake ConnectionManager
            //mysql_connect($dbconfig['host'], $dbconfig['username'], $dbconfig['password']);
            //mysql_select_db($dbconfig['database']);
            //$db_connector = \LTI_Data_Connector::getDataConnector('', 'MySQL');
			
			//JonM 14/6/21: Update to use MySQLi connector
			$db = ConnectionManager::get('default');    //Get the database config using Cake ConnectionManager
		    $dbconfig = $db->config();

			$db_connection_object = mysqli_connect($dbconfig['host'], $dbconfig['username'], $dbconfig['password'], $dbconfig['database']);
            $db_connector = \LTI_Data_Connector::getDataConnector('', $db_connection_object, 'mysqli');  

            
            //Verify the launch
            //This calls the onLaunch method in the LTIToolProviderComponent, which just sets ltilaunch = true
            //Normally would do the LTI launch processing there, but that has to be a static function
            //Therefore, we will do all the processing from here, so we check for ltilaunch below then do the processing
            //Having ltilaunch set to true proves that we have been to LTIToolProviderComponent::onLaunch, which in turns proves that the LTI request was authenticated (see handle_request() method in LTI_Tool_Provider.php)
            $tool = new \LTI_Tool_Provider('App\Controller\Component\LTIToolProviderComponent::onLaunch', $db_connector);
            //var_dump($tool);
			//exit;
			$tool->execute();
            
            //Check that we have gone to the LTIToolProviderComponent::onLaunch method
            if($tool->ltilaunch) {
                //Add Sakai display ID to user data so it can be used as username
                //if(isset($_POST['ext_sakai_provider_displayid']) && !isset($tool->user->displayid)) {
                //    $tool->user->displayid = $_POST['ext_sakai_provider_displayid'];
                //}
                
                //Add the tool to the session
                $session = $this->request->session();
                $session->write('tool', $tool);
                
                //Register the user
                Log::write('debug', 'Trying to save User Details.');
				
                if($user = $this->LtiConsumer->LtiContext->LtiUser->LtiUserUsers->Users->register($tool)) {
                    //Log the user in
                    $this->Auth->setUser($user->toArray());
                    
                    //Look up whether there is a Choice already linked with this Context
                    $choiceContext = $this->LtiConsumer->LtiContext->ChoicesLtiContext->getContextChoice($tool);
                    
                    //If there is a Choice linked with this Context, make sure the user is associated with it, then go to it
                    if(!empty($choiceContext)) {
                        $choiceId = $choiceContext->choice_id;
                        $session->write('choiceId', $choiceId);   //Write the choice ID into the session
                        
                        $this->Redirection->goToDashboardOrView($choiceId, $tool);
                    }
                    //If there is no linked Choice, and user is Staff (i.e. Instructor) or Admin, allow them to create/link a Choice
                    else if($this->LtiConsumer->LtiContext->ChoicesLtiContext->Choices->ChoicesUsers->isLTIStaffOrAdmin($tool)) {
                        $this->redirect(['controller' => 'choices', 'action' => 'add']);
                    }
                    //Otherwise, there is no linked Choice, and user is Learner, so throw error, as Context has not been configured
                    else {
						Log::write('debug', 'User details could not be saved.');
                        throw new ForbiddenException(__('There is no Choice associated with this link.'));
                    }
                }
                else {
                    Log::write('debug', 'User details could not be saved.');
					if(isset($user)) {
						Log::write('debug', $tool);
					}
					
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
