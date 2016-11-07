import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import OptionList from './option-list.jsx';
import Warnings from './selection-warnings.jsx';

import Loader from '../elements/loader.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var SelectionBasket = React.createClass({
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
                    {(!this.props.options.loaded || !this.props.instance.loaded || !this.props.rules.loaded)?
                        <Loader />
                    :
                        <div>
                            {(this.props.selection.optionsSelected.length > 0)?
                                <OptionList
                                    action="view"
                                    instance={this.props.instance.instance}
                                    optionIds={this.props.selection.optionsSelected}
                                    options={this.props.options}
                                    removeButton={true}
                                    removeHandler={this.props.optionContainerHandlers.removeOption}
                                    useCode={this.props.choice.use_code}
                                />
                            :
                                <div>No options chosen</div>
                            }
                        
                            <Warnings
                                rules={this.props.rules}
                                ruleWarnings={this.props.selection.ruleWarnings}
                            />
                            
                            <div style={{marginTop: '15px'}}>
                                <RaisedButton
                                    disabled={!this.props.selection.allowSubmit}
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

module.exports = SelectionBasket;