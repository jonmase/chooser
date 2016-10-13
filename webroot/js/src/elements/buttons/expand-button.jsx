import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

var ExpandButton = React.createClass({
    handleMore: function() {
        if(this.props.handleMore) {
            this.props.handleMore(this.props.id);
        }
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
                </IconButton>
                <FontIcon className="material-icons">more_horiz</FontIcon>*/}
            </span>
        );
    }
});

module.exports = ExpandButton;