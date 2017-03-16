<?php $this->assign('title', $choice['name'] . ' - User Permissions'); ?>

<div id="roles"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard']); ?>";
    data.sections = <?= json_encode($sections); ?>;
    data.roles = <?= json_encode($roles); ?>;
    data.roleIndexesById = <?= json_encode($roleIndexesById); ?>;
    data.currentUserId = <?= $currentUserId; ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/roles-bundle', ['block' => 'script']); ?>
