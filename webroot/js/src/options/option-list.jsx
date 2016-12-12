import React from 'react';

import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';

//import Text from '../elements/display/text-labelled.jsx';
import Text from '../elements/display/text.jsx';
import TextField from '../elements/fields/text.jsx';
import DropdownField from '../elements/fields/dropdown.jsx';
import HiddenField from '../elements/fields/hidden.jsx';

var OptionList = React.createClass({
    render: function() {
        var listItemStyle = {
            //height: '72px'
        };
        
        var showPreferenceInputs = this.props.action === 'review' && this.props.instance.preference;
        var showPreferenceValues = this.props.action === 'confirmed' && this.props.instance.preference;

        if(showPreferenceInputs) {
            listItemStyle.marginLeft = '50px';
            
            //Generate the options for the ranking list
            if(this.props.instance.preference_type === 'rank') {
                var rankDropdownOptions = [];
                var optionCount = this.props.optionIds.length;
                for(var i = 0; i < optionCount; i++) {
                    rankDropdownOptions.push({
                        value: i,
                        label: i + 1,
                    });
                }
            }
        }
        
        if(showPreferenceValues) {
            listItemStyle.marginLeft = '20px';
        }
        
        var showCommentsFieldPerOption = this.props.action === 'review' && this.props.instance.comments_per_option;
        var showCommentsTextPerOption = this.props.action === 'confirmed' && this.props.instance.comments_per_option;
        
        if(showCommentsFieldPerOption) {
            listItemStyle.marginRight = '270px';
        }
        
        //If not using code, action is review and either preference or comments field is showing, move the listItem down slightly so the title appears in the centre of the block
        if(!this.props.useCode && this.props.action === 'review' && (showPreferenceInputs || showCommentsFieldPerOption)) {
            listItemStyle.top = '8px';
        }
                    
        return (
            <List style={this.props.style}>
                {this.props.optionIds.map(function(optionId, optionIndex) {
                    var option = this.props.options.options[this.props.options.indexesById[optionId]];
                    
                    if(this.props.useCode) {
                        var primaryText = option.code;
                        var secondaryText = option.title;
                        var itemHeight = '71px'
                    }
                    else {
                        var primaryText = option.title;
                        
                        //Make secondary text blank...
                        var secondaryText = "";
                        //...unless action is review and either preference or comments field is showing, in which case make it a space, so that it is still there to pad out the list item block
                        if(this.props.action === 'review' && (showPreferenceInputs || showCommentsFieldPerOption)) {
                            secondaryText = " ";
                        }
                        
                        var itemHeight = '47px'
                    }
                    
                    return (
                        <div key={optionId}>
                            {(showPreferenceInputs)?
                                <div style={{float: 'left'}}>
                                    {(this.props.instance.preference_type === 'rank')?
                                        <DropdownField
                                            field={{
                                                disabled: this.props.rankSelectsDisabled,
                                                label: false,
                                                name: "options." + optionId + ".rank",
                                                options: rankDropdownOptions,
                                                required: true,
                                                style: {width: '40px', marginTop: '12px'},
                                                value: optionIndex,
                                            }}
                                            onChange={this.props.handleOrderChange}
                                        />
                                    :""}
                                </div>
                            :""}
                            {(showPreferenceValues)?
                                <div style={{float: 'left', width: '20px', display: 'table', height: itemHeight, tableLayout: 'fixed'}}>
                                    <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
                                        {(this.props.instance.preference_type === 'rank')?
                                            (this.props.optionsSelected[optionId].rank + 1)
                                        :""}
                                    </div>
                                </div>
                            :""}
                        
                            {(showCommentsFieldPerOption)?
                                <div style={{float: 'right', marginTop: '-8px'}}>
                                    <TextField field={{
                                        defaultValue: this.props.optionsSelected[optionId].comments,
                                        label: "Option-specific comments",
                                        //instructions: this.props.instance.comments_overall_instructions,
                                        name: "options." + optionId + ".comments",
                                        onChange: this.props.handleCommentsChange,
                                        section: false,
                                    }} />
                                </div>
                            :""}
                            {(showCommentsTextPerOption)?
                                <div style={{float: 'right', width: '50%', minWidth: '200px', display: 'table', height: itemHeight, tableLayout: 'fixed', textAlign: 'right'}}>
                                    <div style={{display: 'table-cell', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                        {this.props.optionsSelected[optionId].comments}
                                    </div>
                                </div>
                            :""}
                            
                            {this.props.action === 'review' &&
                                <HiddenField value={optionId} name={"options." + optionId + ".choices_option_id"} />
                            }
                            
                            <ListItem
                                disabled={typeof(this.props.disabled) !== "undefined"?this.props.disabled:true}
                                primaryText={primaryText}
                                rightIconButton={
                                    (this.props.removeButton)?
                                        <IconButton
                                            onTouchTap={() => this.props.removeHandler(optionId)}
                                            iconClassName="material-icons"
                                        >
                                            close
                                        </IconButton>
                                    :null
                                }
                                secondaryText={secondaryText}
                                secondaryTextLines={1}
                                style={listItemStyle}
                            />
                            <Divider />
                        </div>
                    );
                }, this)}
            </List>
        );
    }
});

module.exports = OptionList;