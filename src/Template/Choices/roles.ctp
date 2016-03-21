<h1 class="page-title">Dashboard - User Roles</h1>
<p>

<div id="table">
</div>
<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choiceId = "<?= $choice->id; ?>";
    data.subtitle = "<?= $choice->name; ?>";
    data.users = <?= json_encode($choice->users); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/choices-roles-bundle', ['block' => 'script']); ?>
