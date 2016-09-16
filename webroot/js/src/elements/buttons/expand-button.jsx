import React from 'react';
import IconButton from 'material-ui/IconButton';

var ExpandButton = React.createClass({
    handleMore: function() {
        this.props.handleMore(this.props.id);
    },
    /*handleLess: function() {
        this.props.handleLess(this.props.id);
    },*/
    render: function() {
        var tooltip = this.props.tooltip;
        if(typeof(tooltip) === "undefined") {
            tooltip = "More";
        }
        return (
            <span>
                <IconButton
                    iconClassName="material-icons"
                    onTouchTap={this.handleMore}
                    tooltip={tooltip}
                >
                    more_horiz
                </IconButton>         
                {/*<IconButton
                    onTouchTap={this.handleLess}
                    iconClassName="material-icons"
                >
                    expand_less
                </IconButton>*/}
            </span>
        );
    }
});

module.exports = ExpandButton;