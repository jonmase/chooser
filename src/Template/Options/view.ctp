<!--h1 class="page-title">Options</h1-->
<div id="options"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    data.options = <?= json_encode($options); ?>;
    <?php if(!empty($sections)): ?>
        data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard', $choice->id]); ?>";
        data.sections = <?= json_encode($sections); ?>;
    <?php endif; ?>
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/options-view-bundle', ['block' => 'script']); ?>
