<h1 class="page-title">Dashboard</h1>
<div id="grid">
</div>
<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    data.sections = <?= json_encode($sections); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/dashboard-bundle', ['block' => 'script']); ?>
