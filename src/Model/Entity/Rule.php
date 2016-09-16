<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Rule Entity.
 *
 * @property int $id
 * @property int $choosing_instance_id
 * @property \App\Model\Entity\ChoosingInstance $choosing_instance
 * @property string $name
 * @property string $instructions
 * @property string $warning
 * @property string $type
 * @property bool $hard
 * @property string $scope
 * @property int $extra_field_id
 * @property \App\Model\Entity\ExtraField $extra_field
 * @property int $extra_field_option_id
 * @property \App\Model\Entity\ExtraFieldOption $extra_field_option
 * @property int $max
 * @property int $min
 * @property string $allowed_values
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 */
class Rule extends Entity
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
