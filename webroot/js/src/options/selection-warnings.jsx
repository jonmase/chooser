import React from 'react';

import Paper from 'material-ui/Paper';

import TextLabelled from '../elements/display/text-labelled.jsx';

var SelectionWarnings = React.createClass({
    render: function() {
        if(this.props.ruleWarnings) {
            return (
                <Paper rounded={false} zDepth={2} style={{padding: '16px', margin: '15px 0'}}>
                    <h5 style={{marginTop: 0}}>Warnings</h5>
                    {(this.props.allowSubmit)?
                        <p>You can still submit your choices despite these warnings.</p>
                    :
                        <p>You cannot submit your choices at the moment. Please correct the warnings marked with a *.</p>
                    }
                    {this.props.ruleWarnings.map(function(warning) {
                        var rule = this.props.rules.rules[this.props.rules.indexesById[warning.ruleId]];
                        
                        if(rule.scope === 'category_all') {
                            var warningComponent = warning.ruleWarning.map(function(category) {
                                var ruleKey = rule.name + '_' + category.categoryOption;
                                var ruleName = rule.name + ' - ' + category.categoryLabel;
                                
                                return (
                                    <TextLabelled
                                        key={ruleKey}                                                 
                                        label={(rule.hard?"*":"") + ruleName}                                                 
                                        value={category.ruleWarning}
                                    />
                                );
                            });
                            return warningComponent;
                        }
                        else {
                            return (
                                <TextLabelled
                                    key={rule.name}                                                 
                                    label={(rule.hard?"*":"") + rule.name}                                                 
                                    value={warning.ruleWarning}
                                />
                            );
                        }

                    }, this)}
                </Paper>
            );
        }
        else {
            return null;
        }
    }
});

module.exports = SelectionWarnings;