import React from 'react';

import FontIcon from 'material-ui/FontIcon';

var ToggleDisplay = React.createClass({
    render: function() {
        var field = this.props.field;

        return (
            <p style={{lineHeight: '24px'}}>
                <strong style={{verticalAlign: 'top'}}>{field.label}: </strong>
                {field.value?
                    <FontIcon className="material-icons" style={{marginTop: '-2px'}}>check</FontIcon>
                    :
                    <FontIcon className="material-icons" style={{marginTop: '-1px'}}>close</FontIcon>
                }
                <span style={{verticalAlign: 'top'}}>{field.explanation}</span>
            </p>
        );
    }
});

module.exports = ToggleDisplay;