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
                    iconStyle={this.props.iconStyle}
                    onTouchTap={this.handleMore}
                    style={this.props.style}
                    tooltip={tooltip}
                >
                    more_horiz
                </IconButton>         
                {/*<IconButton
                    iconClassName="material-icons"
                    iconStyle={this.props.iconStyle}
                    onTouchTap={this.handleLess}
                style={this.props.style}
                >
                    expand_less
                </IconButton>
                <FontIcon className="material-icons">more_horiz</FontIcon>*/}
            </span>
        );
    }
});

module.exports = ExpandButton;