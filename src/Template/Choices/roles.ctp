<h1 class="page-title">Dashboard - User Roles</h1>
<!--p>
    Define the default role(s) for 'Instructors' (i.e. maintainers and contributors in WebLearn), and give additional roles to specific users. 
</p-->
<div id="roles"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.choice = <?= json_encode($choice); ?>;
    data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard', $choice->id]); ?>";
    data.roleOptions = <?= json_encode($roleOptions); ?>;
    data.sections = <?= json_encode($sections); ?>;
    data.users = <?= json_encode($users); ?>;
    data.userSortField = "<?= $userSortField; ?>";
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/choices-roles-bundle', ['block' => 'script']); ?>
