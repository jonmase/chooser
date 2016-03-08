<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * ChoicesOption Entity.
 *
 * @property int $id
 * @property int $choice_id
 * @property \App\Model\Entity\Choice $choice
 * @property int $option_id
 * @property \App\Model\Entity\Option $option
 * @property int $min_places
 * @property int $max_places
 * @property int $points
 * @property int $preference_points_min
 * @property int $preference_points_max
 * @property bool $published
 * @property \Cake\I18n\Time $published_date
 * @property int $publisher
 * @property bool $approved
 * @property \Cake\I18n\Time $approved_date
 * @property int $approver
 * @property string $extra
 * @property bool $allocations_flag
 * @property bool $allocations_hidden
 * @property int $revision_parent
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 * @property \App\Model\Entity\Allocation[] $allocations
 * @property \App\Model\Entity\OptionsSelection[] $options_selections
 * @property \App\Model\Entity\ShortlistedOption[] $shortlisted_options
 * @property \App\Model\Entity\User[] $users
 */
class ChoicesOption extends Entity
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
