<?php $this->assign('title', $choice['name'] . ' - Options Form'); ?>

<div id="form"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard']); ?>";
    data.sections = <?= json_encode($sections); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/form-bundle', ['block' => 'script']); ?>
