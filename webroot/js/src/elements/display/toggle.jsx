import React from 'react';

import FontIcon from 'material-ui/FontIcon';

var ToggleDisplay = React.createClass({
    render: function() {
        return (
            <span>
                {this.props.field.value?
                    <FontIcon className="material-icons" style={{marginTop: '-2px'}}>check</FontIcon>
                    :
                    <FontIcon className="material-icons" style={{marginTop: '-1px'}}>close</FontIcon>
                }
                <span style={{verticalAlign: 'top'}}>{this.props.field.explanation}</span>
            </span>
        );
    }
});

module.exports = ToggleDisplay;