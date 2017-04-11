import React from 'react';
import FontIcon from 'material-ui/FontIcon';

var UserDefinedFormIcon = React.createClass({
    render: function() {
        //var icon = 'description';
        var icon = 'assignment';
        
        return (
            <FontIcon className="material-icons" title="Include in User Defined Form" style={this.props.style}>{icon}</FontIcon>
        );
    }
});

module.exports = UserDefinedFormIcon;