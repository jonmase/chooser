<h1 class="page-title">Dashboard</h1>
<div id="grid">
</div>
<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.subtitle = "<?= $choice->name; ?>";
    data.roles = <?= json_encode($roles); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/choices-dashboard-bundle', ['block' => 'script']); ?>
