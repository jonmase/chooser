import React from 'react';
import {indigo500} from 'material-ui/styles/colors';

var TextDisplay = React.createClass({
    render: function() {
        return (
            <span style={{color: indigo500}}>
                {this.props.value}
            </span>
        );
    }
});

module.exports = TextDisplay;