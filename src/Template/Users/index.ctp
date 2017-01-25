<div id="roles"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard', $choice->id]); ?>";
    data.sections = <?= json_encode($sections); ?>;
    data.roleOptions = <?= json_encode($roleOptions); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/roles-bundle', ['block' => 'script']); ?>
