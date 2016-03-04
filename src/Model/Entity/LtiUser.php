<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * LtiUser Entity.
 *
 * @property string $consumer_key
 * @property string $context_id
 * @property \App\Model\Entity\LtiContext $lti_context
 * @property string $user_id
 * @property \App\Model\Entity\User $user
 * @property string $lti_result_sourcedid
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $updated
 */
class LtiUser extends Entity
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
        'user_id' => false,
    ];
}
