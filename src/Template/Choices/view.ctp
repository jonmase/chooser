<h1 class="page-title">Options</h1>
<div class="row">
    <div class="col-xs-12 col-md-6">
    </div>
    <div class="col-xs-12 col-md-6">
    </div>
</div>
<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.subtitle = "<?= $choice->name; ?>";
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/choices-manage-bundle', ['block' => 'script']); ?>
