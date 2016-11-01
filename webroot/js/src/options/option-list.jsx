import React from 'react';

import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

import Text from '../elements/display/text.jsx';
import TextField from '../elements/fields/text.jsx';

var OptionList = React.createClass({
    render: function() {
        return (
            <List>
                {this.props.containerState.optionsSelected.map(function(optionId) {
                    var option = this.props.containerState.options[this.props.containerState.optionIndexesById[optionId]];
                    
                    if(this.props.useCode) {
                        var primaryText = option.code;
                        var secondaryText = option.title;
                    }
                    else {
                        var primaryText = option.title;
                        var secondaryText = null;
                    }
                    
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
                    
                    return (
                        <ListItem
                            disabled={typeof(this.props.disabled) !== "undefined"?this.props.disabled:true}
                            key={option.id}
                            primaryText={primaryText}
                            rightIconButton={rightIconButton}
                            secondaryText={secondaryText}
                            secondaryTextLines={1}
                        />
                    );
                }, this)}
            </List>
        );
    }
});

module.exports = OptionList;