<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * EditingInstance Entity.
 *
 * @property int $id
 * @property int $choice_id
 * @property \App\Model\Entity\Choice $choice
 * @property bool $active
 * @property string $instructions
 * @property int $student_defined
 * @property \Cake\I18n\Time $opens
 * @property \Cake\I18n\Time $deadline
 * @property bool $approval_required
 * @property \Cake\I18n\Time $approval_deadline
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $modified
 * @property bool $notify_open
 * @property string $notify_open_extra
 * @property bool $notify_deadline
 * @property string $notify_deadline_extra
 * @property bool $notify_approval_needed
 * @property string $notify_approval_needed_extra
 * @property bool $notify_approval_given
 * @property string $notify_approval_given_extra
 * @property bool $notify_approval_rejected
 * @property string $notify_approval_rejected_extra
 */
class EditingInstance extends Entity
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
