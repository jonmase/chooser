<?php
/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @since         0.10.0
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

$cakeDescription = 'CakePHP: the rapid development php framework';
?>
<!DOCTYPE html>
<html>
<head>
    <?= $this->Html->charset() ?>
    <title>
        Chooser:
        <?= $this->fetch('title') ?>
    </title>
    <?= $this->Html->meta('icon') ?>

    <?= $this->Html->css('base'); ?>
    <?= $this->Html->css('https://fonts.googleapis.com/css?family=Roboto:400,300,500,700'); //Roboto font ?>
    <?= $this->Html->css('https://fonts.googleapis.com/icon?family=Material+Icons'); //Material Icons font ?>
    <?= $this->Html->css('//cdn.jsdelivr.net/flexboxgrid/6.3.0/flexboxgrid.min.css'); //Flexboxgrid ?>
    <?= $this->Html->css('chooser'); ?>

    <!--[if lt IE 9]>
        <script src="node_modules/html5shiv/dist/html5shiv.min.js"></script>
    <![endif]-->
    
    <?= $this->fetch('meta') ?>
    <?= $this->fetch('css') ?>
</head>
<body>
    <nav id="topbar">
    </nav>
    <main class="container-fluid clearfix">
        <?= $this->Flash->render() ?>
        <?= $this->fetch('content') ?>
    </main>
    <footer>
    </footer>
    <?= $this->Html->script('dist/bundle'); ?>
    <?= $this->fetch('script') ?>
</body>
</html>
