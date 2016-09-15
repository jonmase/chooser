import React from 'react';
import IconButton from 'material-ui/IconButton';

var ExpandOption = React.createClass({
    handleExpandMore: function() {
        this.props.handlers.dialogOpen(this.props.optionId);
    },
    /*handleExpandLess: function() {
        this.props.handlers.expandLess(this.props.option);
    },*/
    render: function() {
        return (
            <span>
                <IconButton
                    onTouchTap={this.handleExpandMore}
                    iconClassName="material-icons"
                >
                    more_horiz
                </IconButton>         
                {/*<IconButton
                    onTouchTap={this.handleExpandLess}
                    iconClassName="material-icons"
                >
                    expand_less
                </IconButton>*/}
            </span>
        );
    }
});

module.exports = ExpandOption;