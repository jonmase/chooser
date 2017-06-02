import React from 'react';
import WarningIcon from '../elements/icons/warning.jsx';

var SelectionWarningsExplanation = React.createClass({
    render: function() {
        if(this.props.ruleWarnings) {
            return (
                <span>
                    {(this.props.allowSubmit)?
                        <span>You can still submit your choices despite these warnings</span>
                    :
                        <span>You cannot submit your choices at the moment. Please correct the warnings marked with <WarningIcon colour="red" /></span>
                    }
                </span>
            );
        }
        else {
            return null;
        }
    }
});

module.exports = SelectionWarningsExplanation;