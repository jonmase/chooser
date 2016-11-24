import React from 'react';

var SelectionWarningsTitle = React.createClass({
    render: function() {
        if(this.props.ruleWarnings) {
            return (
                <span>
                    Warnings
                </span>
            );
        }
        else {
            return null;
        }
    }
});

module.exports = SelectionWarningsTitle;