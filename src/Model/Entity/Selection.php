<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Selection Entity.
 *
 * @property int $id
 * @property int $choosing_instance_id
 * @property \App\Model\Entity\ChoosingInstance $choosing_instance
 * @property int $user_id
 * @property \App\Model\Entity\User $user
 * @property bool $archived
 * @property string $comments
 * @property bool $allocations_flag
 * @property bool $allocations_hidden
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 * @property \App\Model\Entity\Allocation[] $allocations
 * @property \App\Model\Entity\Option[] $options
 */
class Selection extends Entity
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
