<h1 class="page-title">Manage Choice</h1>
<div id="grid">
</div>
<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.subtitle = "<?= $choice->name; ?>";
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/choices-manage-bundle', ['block' => 'script']); ?>
