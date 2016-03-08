<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * ChoicesOptionsUser Entity.
 *
 * @property int $id
 * @property int $choices_option_id
 * @property \App\Model\Entity\ChoicesOption $choices_option
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property int $extra_field_id
 * @property \App\Model\Entity\ExtraField $extra_field
 * @property bool $editor
 * @property bool $visible_to_students
 */
class ChoicesOptionsUser extends Entity
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
