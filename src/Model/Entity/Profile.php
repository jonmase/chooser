<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Profile Entity.
 *
 * @property int $id
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property string $sso
 * @property string $title
 * @property string $given_name
 * @property string $last_name
 * @property string $email
 * @property string $phone
 * @property string $department
 * @property string $college
 * @property string $address
 * @property string $biography
 * @property string $lab
 * @property string $image_url
 * @property string $personal_url
 * @property string $lab_url
 * @property int $revision_parent
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 */
class Profile extends Entity
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
