import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';
import RaisedButton from 'material-ui/RaisedButton';

import Loader from '../elements/loader.jsx';
import Text from '../elements/display/text.jsx';
import Wysiwyg from '../elements/display/wysiwyg.jsx';
import DateTime from '../elements/display/datetime.jsx';
import TextLabelled from '../elements/display/text-labelled.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var OptionBasket = React.createClass({
    render: function() {
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    title="Chosen Options"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText 
                    expandable={true}
                    style={styles.cardText}
                >
                    {(!this.props.containerState.optionsLoaded || !this.props.containerState.instanceLoaded || !this.props.containerState.rulesLoaded)?
                        <Loader />
                    :
                        <div>
                            <div>
                                {(this.props.containerState.optionsSelected.length > 0)?
                                    this.props.containerState.optionsSelected.map(function(optionId) {
                                        var option = this.props.containerState.options[this.props.containerState.optionIndexesById[optionId]];
                                        
                                        return (
                                            <div key={option.id}>
                                                {this.props.choice.use_code?
                                                    <Text 
                                                        value={option.code + (this.props.choice.use_title?" - ":"")}
                                                    />
                                                :""}
                                                {this.props.choice.use_title?
                                                    <Text 
                                                        value={option.title}
                                                    />
                                                :""}
                                            </div>
                                        );
                                    }, this)
                                :
                                    <div>No options chosen</div>
                                }
                            </div>
                            {(this.props.containerState.ruleWarnings)?
                                <div>
                                    <h5>Warnings</h5>
                                    {this.props.containerState.ruleWarnings.map(function(warning) {
                                        var rule = this.props.containerState.rules[this.props.containerState.ruleIndexesById[warning.ruleId]];
                                        
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
                                </div>
                            :""}
                            <div style={{marginTop: '15px'}}>
                                <RaisedButton
                                    disabled={!this.props.containerState.allowSubmit}
                                    label="Submit"
                                    onTouchTap={this.props.optionContainerHandlers.submit}
                                    primary={true}
                                />
                            </div>
                        </div>
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = OptionBasket;