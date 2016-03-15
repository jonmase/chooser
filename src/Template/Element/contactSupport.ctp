<?php
use Cake\Core\Configure;
?>
<?= $this->Html->link('contact ' . Configure::read('Support.team') . ' (' . Configure::read('Support.email') . ')', 'mailto: ' . Configure::read('Support.email')); ?>