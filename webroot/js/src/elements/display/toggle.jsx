import React from 'react';

import FontIcon from 'material-ui/FontIcon';

var ToggleDisplay = React.createClass({
    render: function() {
        if(this.props.value) {
            var icon = 'check';
            var marginTop = '-2px';
        }
        else {
            var icon = 'close';
            var marginTop = '-1px';
        }
        return (
            <FontIcon className="material-icons" style={{marginTop: marginTop}}>{icon}</FontIcon>
        );
    }
});

module.exports = ToggleDisplay;