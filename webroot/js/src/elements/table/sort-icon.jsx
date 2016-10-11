import React from 'react';
import IconButton from 'material-ui/IconButton';

var SortIcon = React.createClass({
    render: function() {
        if(this.props.direction && this.props.direction === 'desc') {
            var icon = "arrow_downward";
            var tooltip = "Sort Descending";
        }
        else {
            var icon = "arrow_upward";
            var tooltip = "Sort Ascending";
        }
    
        return (
            <IconButton
                iconClassName="material-icons"
                iconStyle={{width: 16, height: 16, fontSize: 16}}
                style={{padding: 0, width: 16, height: 16, verticalAlign: 'top', marginTop: -2}}
                tooltip={tooltip}
            >
                {icon}
            </IconButton>         
        );
    }
});

module.exports = SortIcon;