<?php
namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * LtiConsumer Entity.
 *
 * @property string $consumer_key
 * @property string $name
 * @property string $secret
 * @property string $lti_version
 * @property string $consumer_name
 * @property string $consumer_version
 * @property string $consumer_guid
 * @property string $css_path
 * @property bool $protected
 * @property bool $enabled
 * @property \Cake\I18n\Time $enable_from
 * @property \Cake\I18n\Time $enable_until
 * @property \Cake\I18n\Time $last_access
 * @property \Cake\I18n\Time $created
 * @property \Cake\I18n\Time $updated
 */
class LtiConsumer extends Entity
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
    ];
}
