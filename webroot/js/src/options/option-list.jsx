import React from 'react';

import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';

import Text from '../elements/display/text.jsx';
import TextField from '../elements/fields/text.jsx';
import DropdownField from '../elements/fields/dropdown.jsx';

var OptionList = React.createClass({
    render: function() {
        if(this.props.removeButton) {
            var rightIconButton =
                <IconButton
                    onTouchTap={() => this.props.removeHandler(optionId)}
                    iconClassName="material-icons"
                >
                    close
                </IconButton>;
        }
        else {
            var rightIconButton = null;
        }
        
        var listItemStyle = {};
        var showCommentsPerOption = this.props.containerState.action === 'confirm' && this.props.containerState.instance.comments_per_option;
        if(showCommentsPerOption) {
            listItemStyle.marginRight = '270px';
        }
        
        var showPreferenceInputs = this.props.containerState.action === 'confirm' && this.props.containerState.instance.preference;
        if(showPreferenceInputs) {
            listItemStyle.marginLeft = '50px';
            
            if(this.props.containerState.instance.preference_type === 'rank') {
                var rankDropdownOptions = [];
                var optionCount = this.props.containerState.optionsSelected.length;
                for(var i = 0; i < optionCount; i++) {
                    rankDropdownOptions.push({
                        value: i,
                        label: i + 1,
                    });
                }
            }
        }
                    
        return (
            <List>
                {this.props.containerState.optionsSelected.map(function(optionId, optionIndex) {
                    var option = this.props.containerState.options[this.props.containerState.optionIndexesById[optionId]];
                    
                    if(this.props.useCode) {
                        var primaryText = option.code;
                        var secondaryText = option.title;
                    }
                    else {
                        var primaryText = option.title;
                        var secondaryText = null;
                    }
                    
                    return (
                        <div key={option.id}>
                            {(showPreferenceInputs)?
                                <div style={{float: 'left'}}>
                                    {(this.props.containerState.instance.preference_type === 'rank')?
                                        <DropdownField
                                            field={{
                                                label: false,
                                                name: "rank_" + option.id,
                                                options: rankDropdownOptions,
                                                required: true,
                                                style: {width: '40px', marginTop: '12px'},
                                                value: optionIndex,
                                            }}
                                            //onChange={this.props.handlers.orderChange}
                                        />
                                    :""}
                                </div>
                            :""}
                        
                            {(showCommentsPerOption)?
                                <div style={{float: 'right', marginTop: '-8px'}}>
                                    <TextField field={{
                                        label: "Option-specific comments",
                                        //instructions: this.props.containerState.instance.comments_overall_instructions,
                                        name: "comments_option_" + option.id,
                                        section: false,
                                        value: null, //this.props.containerState.comments_overall,
                                    }} />
                                </div>
                            :""}
                            
                            <ListItem
                                disabled={typeof(this.props.disabled) !== "undefined"?this.props.disabled:true}
                                primaryText={primaryText}
                                rightIconButton={rightIconButton}
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