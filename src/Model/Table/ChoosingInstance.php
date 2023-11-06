<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * ChoosingInstance Entity.
 *
 * @property int $id
 * @property int $choice_id
 * @property \App\Model\Entity\Choice $choice
 * @property bool $active
 * @property string $choosing_instructions
 * @property bool $choosable
 * @property bool $editable
 * @property \Cake\I18n\Time $opens
 * @property \Cake\I18n\Time $deadline
 * @property \Cake\I18n\Time $extension
 * @property string $preference_type
 * @property int $preference_points
 * @property string $preference_instructions
 * @property int $preferences_only
 * @property int $select_all_initially
 * @property bool $comments_overall
 * @property string $comments_overall_instructions_copy1
 * @property int $comments_overall_limit
 * @property bool $comments_per_option
 * @property string $comments_per_option_instructions
 * @property int $comments_per_option_limit
 * @property bool $editor_preferences
 * @property \Cake\I18n\Time $editor_preferences_deadline
 * @property string $editor_preferences_type
 * @property int $editor_preferences_points
 * @property string $editor_preferences_instructions
 * @property string $extra_questions
 * @property int $allocation_min
 * @property int $allocation_max
 * @property bool $notify_open
 * @property string $notify_open_extra
 * @property bool $notify_deadline
 * @property string $notify_deadline_extra
 * @property bool $notify_submission
 * @property string $notify_submission_extra
 * @property bool $notify_results_available
 * @property string $notify_results_available_extra
 * @property bool $notify_editor_prefs_available
 * @property string $notify_editor_prefs_available_extra
 * @property bool $notify_allocation_available
 * @property string $notify_allocation_available_extra
 * @property bool $notify_student_allocations
 * @property string $notify_student_allocations_extra
 * @property bool $notify_editor_allocations
 * @property string $notify_editor_allocations_extra
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 * @property \App\Model\Entity\Rule[] $rules
 * @property \App\Model\Entity\RulesRelatedCategory[] $rules_related_categories
 * @property \App\Model\Entity\RulesRelatedOption[] $rules_related_options
 * @property \App\Model\Entity\Selection[] $selections
 * @property \App\Model\Entity\ShortlistedOption[] $shortlisted_options
 * @property \App\Model\Entity\StudentPreferenceCategory[] $student_preference_categories
 */
class ChoosingInstance extends Entity
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
