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
        
        if(this.props.showPreferenceInputs) {
            listItemStyle.marginLeft = '50px';
            
            //Generate the options for the ranking list
            if(this.props.preferenceType === 'rank') {
                var rankDropdownOptions = [];
                var optionCount = this.props.optionsSelectedIdsOrdered.length;
                for(var i = 0; i < optionCount; i++) {
                    rankDropdownOptions.push({
                        value: i,
                        label: i + 1,
                    });
                }
            }
        }
        
        if(this.props.showPreferenceValues) {
            listItemStyle.marginLeft = '20px';
        }
        
        if(this.props.showCommentsFieldPerOption) {
            listItemStyle.marginRight = '270px';
        }
        
        //If not using code and either preference or comments field is showing, move the listItem down slightly so the title appears in the centre of the block
        if(!this.props.useCode && (this.props.showPreferenceInputs || this.props.showCommentsFieldPerOption)) {
            listItemStyle.top = '8px';
        }
                    
        return (
            <List style={this.props.style}>
                {this.props.optionsSelectedIdsOrdered.map(function(optionId, optionIndex) {
                    var option = this.props.options[this.props.optionIndexesById[optionId]];
                    
                    if(typeof(option) === "undefined") {
                        //If option is undefined, means that selected option is no longer in options list
                        return (
                            <div key={optionId}>
                                <ListItem
                                    disabled={true}
                                    primaryText="Option is no longer available"
                                    style={listItemStyle}
                                />
                                <Divider />
                            </div>
                        );
                    }
                    else {
                        if(this.props.useCode) {
                            var primaryText = option.code;
                            var secondaryText = option.title;
                            var itemHeight = '71px'
                        }
                        else {
                            var primaryText = option.title;
                            
                            //Make secondary text blank...
                            var secondaryText = "";
                            //...unless either preference or comments field is showing, in which case make it a space, so that it is still there to pad out the list item block
                            if(this.props.showPreferenceInputs || this.props.showCommentsFieldPerOption) {
                                secondaryText = " ";
                            }
                            
                            var itemHeight = '47px'
                        }
                        
                        return (
                            <div key={optionId}>
                                {(this.props.showPreferenceInputs)?
                                    <div style={{float: 'left'}}>
                                        {(this.props.preferenceType === 'rank')?
                                            <DropdownField
                                                field={{
                                                    disabled: this.props.rankSelectsDisabled,
                                                    label: false,
                                                    name: "options." + optionId + ".rank",
                                                    onChange: this.props.handleOrderChange,
                                                    options: rankDropdownOptions,
                                                    required: true,
                                                    style: {width: '40px', marginTop: '12px'},
                                                    value: optionIndex,
                                                }}
                                            />
                                        :""}
                                    </div>
                                :""}
                                {(this.props.showPreferenceValues)?
                                    <div style={{float: 'left', width: '20px', display: 'table', height: itemHeight, tableLayout: 'fixed'}}>
                                        <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
                                            {(this.props.preferenceType === 'rank')&&
                                                (this.props.optionsSelectedById[optionId].rank + 1)
                                            }
                                        </div>
                                    </div>
                                :""}
                            
                                {(this.props.showCommentsFieldPerOption)?
                                    <div style={{float: 'right', marginTop: '-8px'}}>
                                        <TextField field={{
                                            defaultValue: this.props.optionsSelectedById[optionId].comments,
                                            label: "Option-specific comments",
                                            name: "options." + optionId + ".comments",
                                            onChange: this.props.handleCommentsChange,
                                            section: false,
                                        }} />
                                    </div>
                                :""}
                                {(this.props.showCommentsTextPerOption)?
                                    <div style={{float: 'right', width: '50%', minWidth: '200px', display: 'table', height: itemHeight, tableLayout: 'fixed', textAlign: 'right'}}>
                                        <div style={{display: 'table-cell', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                            {this.props.optionsSelectedById[optionId].comments}
                                        </div>
                                    </div>
                                :""}
                                
                                {this.props.hiddenOptionIdField &&
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
                                        :null   //Have to give null as false value, otherwise get warning about using bool when expecting ReactElement
                                    }
                                    secondaryText={secondaryText}
                                    secondaryTextLines={1}
                                    style={listItemStyle}
                                />
                                <Divider />
                            </div>
                        );
                    }
                }, this)}
            </List>
        );
    }
});

module.exports = OptionList;