<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * StudentPreferenceCategory Entity.
 *
 * @property int $id
 * @property int $choosing_instance_id
 * @property \App\Model\Entity\ChoosingInstance $choosing_instance
 * @property string $name
 * @property string $description
 * @property string $type
 * @property int $points
 * @property int $min
 * @property int $max
 * @property int $extra_field_id
 * @property \App\Model\Entity\ExtraField $extra_field
 * @property int $extra_field_option_id
 * @property \App\Model\Entity\ExtraFieldOption $extra_field_option
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 * @property \App\Model\Entity\OptionsSelection[] $options_selections
 */
class StudentPreferenceCategory extends Entity
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
