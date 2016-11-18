import React from 'react';

import TextLabelled from '../elements/display/text-labelled.jsx';

var SelectionWarnings = React.createClass({
    render: function() {
        if(this.props.ruleWarnings) {
            return (
                <div>
                    <h5>Warnings</h5>
                    {this.props.ruleWarnings.map(function(warning) {
                        var rule = this.props.rules.rules[this.props.rules.indexesById[warning.ruleId]];
                        
                        if(rule.scope === 'category_all') {
                            var warningComponent = warning.ruleWarning.map(function(category) {
                                var ruleKey = rule.name + '_' + category.categoryOption;
                                var ruleName = rule.name + ' - ' + category.categoryLabel;
                                
                                return (
                                    <TextLabelled
                                        key={ruleKey}                                                 
                                        label={ruleName}                                                 
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
                                    label={rule.name}                                                 
                                    value={warning.ruleWarning}
                                />
                            );
                        }

                    }, this)}
                    {(this.props.allowSubmit)?
                        <p>You can still submit your choices despite these warnings.</p>
                    :
                        <p>You cannot submit your choices at the moment. Please correct the above warnings.</p>
                    }
                </div>
            );
        }
        else {
            return null;
        }
    }
});

module.exports = SelectionWarnings;