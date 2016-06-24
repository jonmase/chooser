<?php
namespace App\Controller;

use App\Controller\AppController;
use Cake\Network\Exception\InternalErrorException;
use Cake\Network\Exception\MethodNotAllowedException;

/**
 * Profiles Controller
 *
 * @property \App\Model\Table\ProfilesTable $Profiles
 */
class ProfilesController extends AppController
{
    /**
     * View method
     *
     * @param string|null $choiceId Choice id.
     * @return \Cake\Network\Response|null
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($choiceId = null)
    {
        $choice = $this->Profiles->Users->Choices->get($choiceId);

        $profile = $this->Profiles->findProfileByUserId($this->Auth->user('id'));
        
        //If profile is empty, get whatever info we have from the users table
        if(empty($profile)) {
            $user = $this->Auth->user();
            $profile = [
                'user_id' => $user['id'],
                'firstname' => $user['firstname'],
                'lastname' => $user['lastname'],
                'email' => $user['email'],
            ];
        }
        //pr($profile);

        //Get user's roles for this Choice
        $roles = $this->Profiles->Users->Choices->ChoicesUsers->getRolesAsIDsArray($choiceId, $this->Auth->user('id'));
        $sections = $this->Profiles->Users->Choices->getDashboardSections($choiceId, $roles);
        $this->set(compact('choice', 'profile', 'sections'));
        //$this->set('_serialize', ['profile']);
    }
    
    /**
     * save method
     *
     * @param string|null $id Profile id.
     * @return \Cake\Network\Response|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Network\Exception\NotFoundException When record not found.
     */
    public function save()
    {
        if ($this->request->is(['patch', 'post', 'put'])) {
            $this->request->data['user_id'] = $this->Auth->user('id');
            //pr($this->request->data);
            //exit;
            $profile = $this->Profiles->findProfileByUserId($this->Auth->user('id'));
            //pr($profile);
            
            if(empty($profile)) {
                $profile = $this->Profiles->newEntity($this->request->data);
            }
            else {
                //Save existing profile as revision
                $oldProfile = $profile->toArray();
                $oldProfile['revision_parent'] = $profile->id;  //Set the profile ID as the revision_parent
                
                //Remove the record ID, created and modified date
                unset($oldProfile['id'], $oldProfile['created'], $oldProfile['modified']); 

                $oldProfile = $this->Profiles->newEntity($oldProfile);  //Convert to entity
                //pr($oldProfile);

                //Save the old profile
                if(!$this->Profiles->save($oldProfile)) {
                    //pr($oldProfile);
                    throw new InternalErrorException(__('Problem with saving previous profile version'));
                }
                
                //Merge the request data into the existing profile
                $profile = $this->Profiles->patchEntity($profile, $this->request->data);
            }
            //pr($profile);
            //exit;
        
            if($this->Profiles->save($profile)) {
                $this->set('response', 'Profile saved');
            } 
            else {
                throw new InternalErrorException(__('Problem with saving profile'));
            }
        }
        else {
            throw new MethodNotAllowedException(__('Saving profile requires POST'));
        }
    }
}
