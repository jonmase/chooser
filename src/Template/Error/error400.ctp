<?php
use Cake\Core\Configure;
use Cake\Error\Debugger;

$this->layout = 'error';

if (Configure::read('debug')):
    $this->layout = 'dev_error';

    $this->assign('title', $message);
    $this->assign('templateName', 'error400.ctp');

    $this->start('file');
?>
<?php if (!empty($error->queryString)) : ?>
    <p class="notice">
        <strong>SQL Query: </strong>
        <?= h($error->queryString) ?>
    </p>
<?php endif; ?>
<?php if (!empty($error->params)) : ?>
        <strong>SQL Query Params: </strong>
        <?= Debugger::dump($error->params) ?>
<?php endif; ?>
<?= $this->element('auto_table_warning') ?>
<?php
    if (extension_loaded('xdebug')):
        xdebug_print_function_stack();
    endif;

    $this->end();
endif;
?>
<h1><?= h($message) ?></h1>
<p>You have probably got to this page because your session has timed out, or because you tried to access Chooser directly, rather than coming through <?= $this->element('vleLink'); ?>.</p>
<p>To access Chooser, please go to <?= $this->element('vleLink'); ?>.</p>
<p>If you have any further problems accessing or using Chooser, please <?= $this->element('contactSupport'); ?>.</p>