import React from 'react';

import Text from '../elements/display/text-labelled.jsx';

var ChoiceInstructionsRules = React.createClass({
    render: function() {
        if(this.props.rules.length > 0) {
            return (
                <div>
                    <h5>Rules</h5>
                    <div>
                        {this.props.rules.map(function(rule) {
                            return (
                                <div>
                                    <Text label={rule.name} value={rule.instructions} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }
});

module.exports = ChoiceInstructionsRules;