<h1 class="page-title">Dashboard - Permissions</h1>
<div id="table">
</div>
<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choiceId = "<?= $choice->id; ?>";
    data.subtitle = "<?= $choice->name; ?>";
    data.users = <?= json_encode($choice->users); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/choices-permissions-bundle', ['block' => 'script']); ?>
