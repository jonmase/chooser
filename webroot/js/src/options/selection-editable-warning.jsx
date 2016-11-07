import React from 'react';

import DateTime from '../elements/display/datetime.jsx';

var SelectionEditableWarning = React.createClass({
    render: function() {
        return (
            <p>
                <strong>Please Note: </strong>
                {(this.props.instance.editable)?
                    <span>You will be able to return and change your choices until the deadline: <DateTime value={this.props.instance.deadline} /></span>
                :
                    <span>Once you Confirm, you will not be able to change your choices.</span>
                }
            </p>
        );
    }
});

module.exports = SelectionEditableWarning;