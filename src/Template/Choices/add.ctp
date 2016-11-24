<div id="link">
</div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choices = <?= json_encode($choices); ?>
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/lti-link-bundle', ['block' => 'script']); ?>
