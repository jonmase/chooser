<h1 class="page-title">Dashboard - Profile</h1>
<div id="profile"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.subtitle = "<?= $choice->name; ?>";
    data.profile = <?= json_encode($profile); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/profile-bundle', ['block' => 'script']); ?>
