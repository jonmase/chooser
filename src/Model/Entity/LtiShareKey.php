<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * LtiShareKey Entity.
 *
 * @property string $share_key_id
 * @property \App\Model\Entity\ShareKey $share_key
 * @property string $primary_consumer_key
 * @property string $primary_context_id
 * @property \App\Model\Entity\LtiContext $lti_context
 * @property bool $auto_approve
 * @property \Cake\I18n\Time $expires
 */
class LtiShareKey extends Entity
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
        'share_key_id' => false,
    ];
}
