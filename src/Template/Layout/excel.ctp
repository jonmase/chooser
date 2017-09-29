<?php
$debug = 0;
$filename = $this->fetch('filename');
if($debug) {
    echo $filename;
}
else {
    header("Content-Disposition: attachment; filename=\"" . $filename . "\"");
    header("Content-Type: application/vnd.ms-excel");
}
?>
<style>
table{
 border: 1px solid black;
 border-collapse: collapse;
 }
td, th{
 border: 1px solid black
 }
</style>

<?= $this->fetch('content') ?>
