<h1 class="page-title">Dashboard - Choosing Setup</h1>
<div id="view"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard', $choice->id]); ?>";
    data.sections = <?= json_encode($sections); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/choices-setup-bundle', ['block' => 'script']); ?>
