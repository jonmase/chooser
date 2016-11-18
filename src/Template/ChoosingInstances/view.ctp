<div id="view"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard', $choice->id]); ?>";
    data.sections = <?= json_encode($sections); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/settings-bundle', ['block' => 'script']); ?>
