<?php
use Cake\Core\Configure;
?>
<?= $this->Html->link(Configure::read('VLE.name'), Configure::read('VLE.url')); ?>