import React from 'react';

import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

import Text from '../elements/display/text.jsx';
import TextField from '../elements/fields/text.jsx';

var OptionCommentsList = React.createClass({
    render: function() {
        return (
            <List>
                {this.props.containerState.optionsSelected.map(function(optionId) {
                    var option = this.props.containerState.options[this.props.containerState.optionIndexesById[optionId]];
                    
                    var primaryText = <TextField field={{
                        label: "Option-specific comments",
                        //instructions: this.props.containerState.instance.comments_overall_instructions,
                        name: "comments_option_" + option.id,
                        section: false,
                        value: null, //this.props.containerState.comments_overall,
                    }} />
                    
                    
                    return (
                        <ListItem
                            disabled={true}
                            key={option.id}
                            primaryText={primaryText}
                            secondaryText={null}
                            style={{
                                padding: '3px 0',
                                marginTop: '-6px'
                            }}
                        />
                    );
                }, this)}
            </List>
        );
    }
});

module.exports = OptionCommentsList;