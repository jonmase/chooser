<?php $this->assign('filename', $filename); ?>

<h2><?php echo $choice['name'] . " Responses By Student"; ?></h2>
<h4>
    Responses: 
    <?php //echo $statistics['confirmed_count'] . " submitted (" . ($statistics['selection_count'] - $statistics['confirmed_count']) . " unsubmitted)"; ?>
    <?php echo $statistics['confirmed_count']; ?>
</h4>

<h4>Options:  <?php echo count($options); ?></h4>

<?php if($choosingInstance['preference']): ?>
    <?php if($choosingInstance['preference_type'] === 'rank'): ?>
        <h4>Values in the table show the respondent's preference order for each option chosen</h4>
    <?php endif; ?>
<?php endif; ?>


<?php 
$headerColspan = 6;
if($choosingInstance['comments_overall']): $headerColspan++; endif;

$optionColspan = 1;
if($choosingInstance['comments_per_option']): $optionColspan++; endif;

?>

<table>
	<?php if($choice['use_code']): ?>
		<tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Code: </th>
            <?php foreach($options as $option): ?>
                <th style="vertical-align: top" colspan=<?php echo $optionColspan; ?>><?php echo $option['code']; ?></th>
            <?php endforeach; ?>
		</tr>
	<?php endif; ?>
	<tr>
		<th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Name: </th>
		<?php 
            $optionIds = array();
            $i = 0;
            foreach($options as $option): 
        ?>
            <th style="vertical-align: top" colspan=<?php echo $optionColspan; ?>>
            <?php 
                echo $option['title'];
                $optionIds[$i] = $option['id'];
                $i++;
            ?>
            </th>
        <?php endforeach; ?>
	</tr>
	<?php if($choice['use_points']): ?>
		<tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Points: </th>
            
            <?php foreach($options as $option): ?>
                <th style="vertical-align: top" colspan=<?php echo $optionColspan; ?>><?php echo $option['points']; ?></th>
            <?php endforeach; ?>
		</tr>
	<?php endif; ?>
	<?php if($choice['use_min_places']): ?>
		<tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Min. Places: </th>
            
            <?php foreach($options as $option): ?>
                <th style="vertical-align: top" colspan=<?php echo $optionColspan; ?>><?php echo $option['min_places']; ?></th>
            <?php endforeach; ?>
		</tr>
	<?php endif; ?>
	<?php if($choice['use_max_places']): ?>
		<tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Max. Places: </th>
            
            <?php foreach($options as $option): ?>
                <th style="vertical-align: top" colspan=<?php echo $optionColspan; ?>><?php echo $option['max_places']; ?></th>
            <?php endforeach; ?>
		</tr>
	<?php endif; ?>
	<?php if($choosingInstance['comments_per_option']):  ?>
        <tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Chosen by: </th>
            <?php foreach($options as $option): ?>
                <th style="vertical-align: top" colspan=<?php echo $optionColspan; ?>><?php echo $option['count']; ?></th>
            <?php endforeach; ?>
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
			<th style="vertical-align: top">Submitted</th>
			<?php foreach($options as $option): ?>
                <th style="vertical-align: top">
                    <?php echo ($choosingInstance['preference'])?(($choosingInstance['preference_type'] === 'rank')?'Rank':'Pref. Points'):'Selected'; ?>
                </th>
                <th style="vertical-align: top">Option Comments</th>
            <?php endforeach; ?>
		<?php else: ?>
			<th style="vertical-align: top">Submitted\Chosen by:</th>
			<?php foreach($options as $option): ?>
				<th style="vertical-align: top"><?php echo $option['count']; ?></th>
            <?php endforeach; ?>
		<?php endif; ?>
	</tr>
    <?php foreach($selections as $selection): ?>
        <tr>
            <td><?php echo $selection['user']['username']; ?></td>
            <td><?php echo $selection['user']['firstname']; ?></td>
            <td><?php echo $selection['user']['lastname']; ?></td>
            <td><?php echo $selection['user']['email']; ?></td>
            <td><?php echo $selection['option_count']; ?></td>
            <?php if($choosingInstance['comments_overall']):?>
                <td><?php echo $selection['comments']; ?></td>
            <?php endif; ?>
            <td><?php echo $selection['modified']['formatted']; ?></td>
            
            <?php foreach($options as $option): ?>
                <td>
                    <?php if(in_array($option['id'], $selection['options_selected_ids_ordered'])):
                        if($choosingInstance['preference'] && $choosingInstance['preference_type'] === 'rank'):
                            echo ($selection['options_selected_by_id'][$option['id']]['rank'] + 1);
                        else:
                            echo "1";
                        endif;
                    endif; ?>
                </td>
                <?php if($choosingInstance['comments_per_option']): ?> 
                    <td>
                        <?php echo $selection['options_selected_by_id'][$option['id']]['comments']; ?>
                    </td>
                <?php endif; ?>
            <?php endforeach; ?>
        </tr>
    <?php endforeach; ?>
</table>