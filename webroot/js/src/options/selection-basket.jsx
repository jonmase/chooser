import React from 'react';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import OptionList from './option-list.jsx';
import Warnings from './selection-warnings.jsx';

var SelectionBasket = React.createClass({
    render: function() {
        return (
            <div>
                {(this.props.selection.ruleWarnings)&&
                    <Card className="page-card">
                        <CardHeader 
                            title="Warnings" 
                            subtitle="You cannot submit your choices at the moment. Please correct the warnings marked with a *"
                        />
                        <CardText style={{paddingTop: 0}}>
                            <Warnings
                                allowSubmit={this.props.selection.allowSubmit}
                                rules={this.props.rules}
                                ruleWarnings={this.props.selection.ruleWarnings}
                            />
                        </CardText>
                        {(!this.props.selection.allowSubmit) && 
                            <CardActions>
                                <RaisedButton 
                                    label="Change Choices" 
                                    onTouchTap={this.props.optionContainerHandlers.change} 
                                    primary={true} 
                                />
                            </CardActions>
                        }
                    </Card>
                }
                
                <Card className="page-card">
                    <CardHeader title="Your Choices" />
                    <CardText style={{paddingTop: 0}}>
                        {/*<p style={{margin: 0}}>You have chosen the following options:</p>*/}
                        {(this.props.optionsSelectedTableOrder.length > 0)?
                            <OptionList
                                action="view"
                                instance={this.props.instance}
                                optionIds={this.props.optionsSelectedTableOrder}
                                options={this.props.options}
                                removeButton={true}
                                removeHandler={this.props.optionContainerHandlers.remove}
                                useCode={this.props.useCode}
                            />
                        :
                            <p>No options chosen</p>
                        }
                    </CardText>
                </Card>
            </div>
        );
    }
});

module.exports = SelectionBasket;