import React from 'react';

import DateTime from '../elements/display/datetime.jsx';

var SelectionEditableWarning = React.createClass({
    render: function() {
        var style={
            marginBottom: 0,
        };
        
        if(this.props.noTopMargin) {
            style.marginTop = 0;
        }
    
        return (
            <p style={style}>
                <strong>Please Note: </strong>
                {(this.props.instance.editable)?
                    <span>You will be able to return and amend your choices until the deadline at&nbsp;
                        {!this.props.instance.deadline.passed?
                            <DateTime value={this.props.instance.deadline} />
                        :
                            <DateTime value={this.props.instance.extension} />
                        }
                    </span>
                :
                    <span>Once you Confirm, you will not be able to amend your choices.</span>
                }
            </p>
        );
    }
});

module.exports = SelectionEditableWarning;