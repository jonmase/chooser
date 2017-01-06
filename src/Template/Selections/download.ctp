<?php
$debug = 1;
$filename = str_replace(' ', '_', $choice['name']) . "_Responses.xls";
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
<h2><?php echo $choice['name'] . " Responses"; ?></h2>
<h4>Responses: <?php echo $statistics['confirmed_count'] . " submitted (" . ($statistics['selection_count'] - $statistics['confirmed_count']) . " unsubmitted)"; ?></h4>
<?php 
if($choosingInstance['preference']):
    if($choosingInstance['preference_type'] === 'rank'):
?>
<h4>Values in the table show the respondent's preference order for each option chosen</h4>
<?php 
    endif;
endif;
?>


<?php 
$headerColspan = 6;
if($choosingInstance['comments_overall']): $headerColspan++; endif;
$optionColspan = 1;
if($choosingInstance['comments_per_option']): $optionColspan++; endif;

?>

<table>
	<?php if($choice['use_code']) { ?>
		<tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Code: </th>
            
            <?php 
                foreach($options as $option) {
                    echo '<th style="vertical-align: top" colspan=' . $optionColspan. '>' . $option['code'] . '</th>';
                }
            ?>
		</tr>
	<?php } ?>
	<tr>
		<th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Name: </th>
		<?php 
			$optionIds = array();
			$i = 0;
			foreach($options as $option) {
				echo '<th style="vertical-align: top" colspan=' . $optionColspan. '>';
                echo $option['title'];
				echo '</th>';
				$optionIds[$i] = $option['id'];
				$i++;
			}
		?>
	</tr>
	<?php if($choice['use_points']) { ?>
		<tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Points: </th>
            
            <?php 
                foreach($options as $option) {
                    echo '<th style="vertical-align: top" colspan=' . $optionColspan. '>' . $option['points'] . '</th>';
                }
            ?>
		</tr>
	<?php } ?>
	<?php if($choice['use_min_places']) { ?>
		<tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Min. Places: </th>
            
            <?php 
                foreach($options as $option) {
                    echo '<th style="vertical-align: top" colspan=' . $optionColspan. '>' . $option['min_places'] . '</th>';
                }
            ?>
		</tr>
	<?php } ?>
	<?php if($choice['use_max_places']) { ?>
		<tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Max. Places: </th>
            
            <?php 
                foreach($options as $option) {
                    echo '<th style="vertical-align: top" colspan=' . $optionColspan. '>' . $option['max_places'] . '</th>';
                }
            ?>
		</tr>
	<?php } ?>
	<?php if($choosingInstance['comments_per_option']):  ?>
        <tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Chosen by: </th>
            
            <?php 
                foreach($options as $option) {
                    //echo '<th style="vertical-align: top">' . count($option[$ucaseType. 'Choice']) . '</th>';
                    echo '<th style="vertical-align: top" colspan=' . $optionColspan. '>' . $option['count'] . '</th>';
                }
            ?>
        </tr>
	<?php endif; ?>
	<tr>
		<th style="vertical-align: top">Username</th>
		<th style="vertical-align: top">First Name</th>
		<th style="vertical-align: top">Last Name</th>
		<th style="vertical-align: top">Email</th>
		<th style="vertical-align: top">Count</th>
		<?php if($choosingInstance['comments_overall']): ?><th style="vertical-align: top">Comments</th><?php endif; ?>
		<?php if($choosingInstance['comments_per_option']):  ?>
			<th style="vertical-align: top"> 
				Submitted
			</th>
			<?php 
				foreach($options as $option) {
					echo '<th style="vertical-align: top">';
					echo ($choosingInstance['preference'])?(($choosingInstance['preference_type'] === 'rank')?'Rank':'Pref. Points'):'Selected';
					echo '</th>';
					echo '<th style="vertical-align: top">';
					echo 'Opt. Comments';
					echo '</th>';
				}
			?>
		<?php else: ?>
			<th style="vertical-align: top"> 
				Submitted\Chosen by:
			</th>
			<?php 
				foreach($options as $option) {
					echo '<th style="vertical-align: top" colspan=' . $optionColspan. '>' . $option['count'] . '</th>';
				}
			?>
		<?php endif; ?>
	</tr>
<?php 
/*
	//pr($optionIds);
	foreach($choices as $choice) {
		echo "<tr>";
		echo "<td>" . $choice['LtiUser']['username'] . "</td><td>" . $choice['LtiUser']['lti_name_given'] . "</td><td>" . $choice['LtiUser']['lti_name_family'] . "</td>";
		echo "<td>" . count($choice[$ucaseType . 'Choice']) . "</td>";
 		if($schedule['Schedule']['student_comments']): echo "<td>" . $choice['Choice']['comments'] . "</td>"; endif;
 		echo "<td>" . $choice['Choice']['modified'] . "</td>";
		
		$userChoices = array();
		$supervisorsMet = array();
		if($schedule['Schedule']['ranked']) {
			foreach($choice[$ucaseType . 'Choice'] as $optionChoice) {
				$userChoices[$optionChoice[$type . '_id']] = $optionChoice['order'] + 1;
				$supervisorsMet[$optionChoice[$type . '_id']] = $optionChoice['met_supervisor'];
			}
		}
		else {
			foreach($choice[$ucaseType . 'Choice'] as $optionChoice) {
				$userChoices[$optionChoice[$type . '_id']] = 1;
				$supervisorsMet[$optionChoice[$type . '_id']] = $optionChoice['met_supervisor'];
			}
		}
		foreach($optionIds as $optionId) {
			echo "<td>";
			if(array_key_exists($optionId, $userChoices)) {
				echo $userChoices[$optionId];
			}
			echo "</td>";
			if($schedule['Schedule']['check_supervisor_meeting']): 
				echo "<td>";
				if(array_key_exists($optionId, $supervisorsMet)):
					echo ($supervisorsMet[$optionId])?1:0;
					echo "</td>";
				endif;
			endif;
		}
		echo "</tr>";
	}*/
?>
</table>