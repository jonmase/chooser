<div id="index">
</div>

<?= $this->Html->scriptStart(['block' => true]); ?>
    var data = {};
    data.action = "<?= $action; ?>";
    data.choice = <?= json_encode($choice); ?>;
    data.role = "<?= $role; ?>";
    data.title = "<?php switch($action):
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
        endswitch; ?>";
    <?php if(!empty($sections)): ?>
        data.dashboard = "<?= $this->Url->build(['controller' => 'choices', 'action' => 'dashboard', $choice->id]); ?>";
        data.sections = <?= json_encode($sections); ?>;
    <?php endif; ?>
<?= $this->Html->scriptEnd(); ?>
<?= $this->Html->script('dist/options-bundle', ['block' => 'script']); ?>
