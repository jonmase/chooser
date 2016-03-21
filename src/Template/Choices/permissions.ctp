<h1 class="page-title">Dashboard - Permissions</h1>
<div id="grid">
</div>
<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choiceId = "<?= $choice->id; ?>";
    data.subtitle = "<?= $choice->name; ?>";
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/choices-permissions-bundle', ['block' => 'script']); ?>
