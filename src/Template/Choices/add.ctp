<h1 class="page-title">Choice Setup</h1>
<div class="row">
    <?php if(!$choices->isEmpty()): ?>
        <div class="col-xs-12 col-md-6">
            <h2 class="no-top-margin">Select existing Choice</h2>
            <?= $this->Flash->render('link-choice-error') ?>
            <div id="link_choice_form"></div>
        </div>
    <?php endif; ?>
    <div class="col-xs-12 col-md-6">
        <h2 class="no-top-margin">Create new Choice</h2>
        <?= $this->Flash->render('new-choice-error') ?>
        <p>Enter the details below to create a new Choice.</p>
        <div id="new_choice_form"></div>
    </div>
</div>
<?= $this->Html->scriptStart(['block' => true]); ?>
    var adminChoicesList = <?= json_encode($choices); ?>
<?= $this->Html->scriptEnd(); ?>
