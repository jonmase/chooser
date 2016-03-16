<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * ChoicesUser Entity.
 *
 * @property int $id
 * @property int $choice_id
 * @property \App\Model\Entity\Choice $choice
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property bool $editor
 * @property bool $approver
 * @property bool $reviewer
 * @property bool $allocator
 * @property bool $admin
 */
class ChoicesUser extends Entity
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
