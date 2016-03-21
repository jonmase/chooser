<h1 class="page-title">Dashboard - User Roles</h1>
<p>
    Define the default role(s) for 'Instructors' (i.e. maintainers and contributors in WebLearn), and give additional roles to specific users. 
</p>
<div id="roles_settings"></div>
<br />
<div id="table"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choiceId = "<?= $choice->id; ?>";
    data.subtitle = "<?= $choice->name; ?>";
    data.defaultRoles = <?= json_encode($choice->instructor_default_roles); ?>;
    data.roleOptions = <?= json_encode($additionalRoles); ?>;
    data.users = <?= json_encode($choice->users); ?>;
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/choices-roles-bundle', ['block' => 'script']); ?>
