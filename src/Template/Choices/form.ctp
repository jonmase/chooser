<h1 class="page-title">Dashboard - Options Form</h1>
<div id="form"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/choices-form-bundle', ['block' => 'script']); ?>
