import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';

var SortMenu = React.createClass({
    handleChange: function(event, field) {
        //Call the passed handleClick method, without passing any arguments
        //If call this directly from onTouchTap, event gets passed, which then makes it think it is getting an optionId
        if(this.props.handleChange) {
            this.props.handleChange(field);
        }
    },
    
    render: function() {
        var tooltip = this.props.tooltip
        if(typeof(tooltip) === "undefined") {
            tooltip = "Sort";
        }
        return (
            <IconMenu
                iconButtonElement={<IconButton iconClassName="material-icons" tooltip={tooltip}>sort</IconButton>}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                value={this.props.sortValue}
                onChange={this.handleChange}
            >
                {this.props.items.map(function(item) {
                    return (
                        <MenuItem key={item.value} value={item.value} primaryText={item.label} />
                    );
                }, this)}
            </IconMenu>            
        );
    }
});

module.exports = SortMenu;