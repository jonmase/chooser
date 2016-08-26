<h1 class="page-title">Dashboard - Options</h1>
<div id="index"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    data.options = <?= json_encode($options); ?>;
    data.optionIds = <?= json_encode($optionIds); ?>;
    data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard', $choice->id]); ?>";
    data.sections = <?= json_encode($sections); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/options-index-bundle', ['block' => 'script']); ?>
