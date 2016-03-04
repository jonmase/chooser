<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * User Entity.
 *
 * @property int $id
 * @property string $lis_person_sourcedid
 * @property string $ext_sakai_eid
 * @property string $ext_sakai_provider_displayid
 * @property string $lis_person_contact_email_primary
 * @property string $lis_person_name_full
 * @property string $lis_person_name_given
 * @property string $lis_person_name_family
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 * @property \App\Model\Entity\LtiUser[] $lti_user
 */
class User extends Entity
{

    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        '*' => true,
        'id' => false,
    ];
}
