<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Choice Entity.
 *
 * @property int $id
 * @property string $name
 * @property bool $private
 * @property string $instructor_default_roles
 * @property bool $notify_additional_permissions
 * @property string $notify_additional_permissions_custom
 * @property \App\Model\Entity\LtiContext[] $lti_context
 */
class Choice extends Entity
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
