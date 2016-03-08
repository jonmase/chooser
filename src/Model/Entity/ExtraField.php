<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * ExtraField Entity.
 *
 * @property int $id
 * @property int $choice_id
 * @property \App\Model\Entity\Choice $choice
 * @property string $label
 * @property string $instructions
 * @property string $type
 * @property string $default
 * @property string $extra
 * @property bool $show_to_students
 * @property bool $filterable
 * @property bool $sortable
 * @property bool $required
 * @property bool $in_user_defined_form
 * @property bool $rule_category
 * @property \App\Model\Entity\ChoicesOptionsUser[] $choices_options_users
 * @property \App\Model\Entity\ExtraFieldOption[] $extra_field_options
 * @property \App\Model\Entity\StudentPreferenceCategory[] $student_preference_categories
 */
class ExtraField extends Entity
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
