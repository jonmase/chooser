<div id="roles"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard', $choice->id]); ?>";
    data.roleOptions = <?= json_encode($roleOptions); ?>;
    data.sections = <?= json_encode($sections); ?>;
    data.users = <?= json_encode($users); ?>;
    data.userSortField = "<?= $userSortField; ?>";
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/roles-bundle', ['block' => 'script']); ?>
