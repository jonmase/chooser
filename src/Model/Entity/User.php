<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * User Entity.
 *
 * @property int $id
 * @property string $username
 * @property string $email
 * @property string $fullname
 * @property string $firstname
 * @property string $lastname
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 * @property \App\Model\Entity\EditorPreference[] $editor_preferences
 * @property \App\Model\Entity\LtiUser[] $lti_user
 * @property \App\Model\Entity\Profile[] $profiles
 * @property \App\Model\Entity\Selection[] $selections
 * @property \App\Model\Entity\ShortlistedOption[] $shortlisted_options
 * @property \App\Model\Entity\ChoicesOption[] $choices_options
 * @property \App\Model\Entity\Choice[] $choices
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
