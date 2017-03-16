<?php $this->assign('title', $choice['name'] . ' - Results'); ?>

<div id="index">
</div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    <?php if(!empty($sections)): ?>
        data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard']); ?>";
        data.sections = <?= json_encode($sections); ?>;
    <?php endif; ?>
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/results-bundle', ['block' => 'script']); ?>
