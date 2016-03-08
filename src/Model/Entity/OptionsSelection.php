<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * OptionsSelection Entity.
 *
 * @property int $id
 * @property int $selection_id
 * @property \App\Model\Entity\Selection $selection
 * @property int $choices_option_id
 * @property \App\Model\Entity\ChoicesOption $choices_option
 * @property int $student_preference_category_id
 * @property \App\Model\Entity\StudentPreferenceCategory $student_preference_category
 * @property int $rank
 * @property int $points
 * @property string $comments
 * @property \App\Model\Entity\EditorPreference[] $editor_preferences
 */
class OptionsSelection extends Entity
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
