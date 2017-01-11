<?php $this->assign('filename', $filename); ?>

<h2><?php echo $choice['name'] . " Responses By Option"; ?></h2>

<h4>Options: <?php echo count($options); ?></h4>

<h4>Responses: 
    <?php //echo $statistics['confirmed_count'] . " submitted (" . ($statistics['selection_count'] - $statistics['confirmed_count']) . " unsubmitted)"; ?>
    <?php echo $statistics['confirmed_count']; ?>
</h4>

<?php if($choosingInstance['preference']): ?>
    <?php if($choosingInstance['preference_type'] === 'rank'): ?>
        <h4>Values in the table show the respondent's preference order for each option chosen</h4>
    <?php endif; ?>
<?php endif; ?>

<?php 
$headerColspan = 2;
if($choice['use_code']): $headerColspan++; endif;
if($choice['use_points']): $headerColspan++; endif;
if($choice['use_min_places']): $headerColspan++; endif;
if($choice['use_max_places']): $headerColspan++; endif;

$selectionColspan = 1;
if($choosingInstance['comments_per_option']): $selectionColspan++; endif;
?>

<table>
    <tr>
        <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Username: </th>
        <?php foreach($selections as $selection): ?>
            <th style="vertical-align: top" colspan=<?php echo $selectionColspan; ?>><?php echo $selection['user']['username']; ?></th>
        <?php endforeach; ?>
    </tr>
    
	<tr>
		<th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Name: </th>
        <?php foreach($selections as $selection): ?>
            <th style="vertical-align: top" colspan=<?php echo $selectionColspan; ?>><?php echo $selection['user']['fullname']; ?></th>
        <?php endforeach; ?>
	</tr>
    
	<?php if($choosingInstance['comments_overall']): ?>
        <tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Comments: </th>
            <?php foreach($selections as $selection): ?>
                <th style="vertical-align: top" colspan=<?php echo $selectionColspan; ?>><?php echo $selection['comments']; ?></th>
            <?php endforeach; ?>
        </tr>
    <?php endif; ?>
    
	<?php if($choosingInstance['comments_per_option']): ?>
        <tr>
            <th colspan=<?php echo $headerColspan; ?> style="text-align: right;">Count: </th>
            <?php foreach($selections as $selection): ?>
                <th style="vertical-align: top" colspan=<?php echo $selectionColspan; ?>><?php echo $selection['option_count']; ?></th>
            <?php endforeach; ?>
        </tr>
	<?php endif; ?>
    
	<tr>
        <?php if($choice['use_code']): ?>
            <th style="vertical-align: top">Code</th>
        <?php endif; ?>
		<th style="vertical-align: top">Title</th>
        <?php if($choice['use_points']): ?>
            <th style="vertical-align: top">Points</th>
        <?php endif; ?>
        <?php if($choice['use_min_places']): ?>
            <th style="vertical-align: top">Min. Places</th>
        <?php endif; ?>
        <?php if($choice['use_max_places']): ?>
            <th style="vertical-align: top">Max. Places</th>
        <?php endif; ?>
		<?php if($choosingInstance['comments_per_option']):  ?>
			<th style="vertical-align: top">Chosen By</th>
			<?php foreach($selections as $selection): ?>
                <th style="vertical-align: top">
                    <?php echo ($choosingInstance['preference'])?(($choosingInstance['preference_type'] === 'rank')?'Rank':'Pref. Points'):'Selected'; ?>
                </th>
                <th style="vertical-align: top">Option Comments</th>
            <?php endforeach; ?>
		<?php else: ?>
			<th style="vertical-align: top">Chosen By\Count:</th>
			<?php foreach($selections as $selection): ?>
					<th style="vertical-align: top"><?php echo $selection['option_count']; ?></th>
            <?php endforeach; ?>
		<?php endif; ?>
	</tr>
    
    <?php foreach($options as $option): ?>
		<tr>
            <?php if($choice['use_code']): ?>
                <td><?php echo $option['code']; ?></td>
            <?php endif; ?>
            
            <td><?php echo $option['title']?></td>
            
            <?php if($choice['use_points']): ?>
                <td><?php echo $option['points']; ?></td>
            <?php endif; ?>
            
            <?php if($choice['use_min_places']): ?>
                <td><?php echo $option['min_places']; ?></td>
            <?php endif; ?>
            
            <?php if($choice['use_max_places']): ?>
                <td><?php echo $option['max_places']; ?></td>
            <?php endif; ?>
            
             <td><?php echo $option['count']; ?></td>
            
            <?php foreach($selections as $selection): ?>
                <td>
                    <?php 
                    if(in_array($option['id'], $selection['options_selected_ids_ordered'])):
                        if($choosingInstance['preference'] && $choosingInstance['preference_type'] === 'rank'):
                            echo ($selection['options_selected_by_id'][$option['id']]['rank'] + 1);
                        else:
                            echo "1";
                        endif;
                    endif;
                    ?>
                </td>
            <?php endforeach; ?>
		</tr>
	<?php endforeach; ?>
</table>