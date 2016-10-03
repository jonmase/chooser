<h1 class="page-title">
    <?php switch($action):
        case 'view': 
            break;
        case 'edit':
            echo 'Dashboard - Edit Options';
            break;
        case 'edit':
            echo 'Dashboard - Approve Options';
            break;
        default:
            break;
    endswitch; ?>
</h1>
<div id="index"></div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.action = "<?= $action; ?>";
    data.choice = <?= json_encode($choice); ?>;
    data.options = <?= json_encode($options); ?>;
    data.optionIds = <?= json_encode($optionIds); ?>;
    <?php if($action === 'view'): ?>
        data.instance = <?= json_encode($instance); ?>;
    <?php endif; ?>
    <?php if($hasAdditionalRoles): ?>
        data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard', $choice->id]); ?>";
        data.sections = <?= json_encode($sections); ?>;
    <?php endif; ?>
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/options-bundle', ['block' => 'script']); ?>
