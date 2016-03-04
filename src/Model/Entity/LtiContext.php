<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * LtiContext Entity.
 *
 * @property string $consumer_key
 * @property string $context_id
 * @property \App\Model\Entity\Context $context
 * @property string $lti_context_id
 * @property string $lti_resource_id
 * @property \App\Model\Entity\LtiResource $lti_resource
 * @property string $title
 * @property string $settings
 * @property string $primary_consumer_key
 * @property string $primary_context_id
 * @property \App\Model\Entity\LtiContext $lti_context
 * @property bool $share_approved
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $updated
 */
class LtiContext extends Entity
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
        'consumer_key' => false,
        'context_id' => false,
    ];
}
