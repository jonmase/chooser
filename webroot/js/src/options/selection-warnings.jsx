import React from 'react';

import TextLabelled from '../elements/display/text-labelled.jsx';
import WarningIcon from '../elements/icons/warning.jsx';

var SelectionWarnings = React.createClass({
    render: function() {
        var warningIcon = <span style={{marginRight: '5px'}}>{<WarningIcon colour="red" />}</span>;
    
        if(this.props.ruleWarnings) {
            return (
                <div>
                    {this.props.ruleWarnings.map(function(warning) {
                        var rule = this.props.rules.rules[this.props.rules.indexesById[warning.ruleId]];
                        
                        if(rule.scope === 'category_all') {
                            var warningComponent = warning.ruleWarning.map(function(category) {
                                var ruleKey = rule.name + '_' + category.categoryOption;
                                var ruleName = rule.name + ' - ' + category.categoryLabel;
                                
                                return (
                                    <TextLabelled
                                        key={ruleKey}                                                 
                                        label={<span>{(rule.hard)&&warningIcon}{ruleName}</span>}                                                 
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
                                    label={<span>{(rule.hard)&&warningIcon}{rule.name}</span>}                                                 
                                    value={warning.ruleWarning}
                                />
                            );
                        }

                    }, this)}
                </div>
            );
        }
        else {
            return null;
        }
    }
});

module.exports = SelectionWarnings;