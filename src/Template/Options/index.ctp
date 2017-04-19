<?php 
$this->assign('title', $choice['name'] . ' - ' . ($action === 'edit'?'Edit ':'') . 'Options'); 
//pr($sections);
?>


<div id="index">
</div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.action = "<?= $action; ?>";
    data.choice = <?= json_encode($choice); ?>;
    data.roles = <?= json_encode($roles); ?>;
    <?php if(!empty($sections)): ?>
        data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard']); ?>";
        data.sections = <?= json_encode($sections); ?>;
    <?php endif; ?>
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/options-bundle', ['block' => 'script']); ?>
