import React from 'react';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';

import OptionList from './option-list.jsx';
import Warnings from './selection-warnings.jsx';
import WarningsTitle from './selection-warnings-title.jsx';
import WarningsExplanation from './selection-warnings-explanation.jsx';
import WarningIcon from '../elements/icons/warning.jsx';

var SelectionBasket = React.createClass({
    render: function() {
        return (
            <div>
                {(this.props.selection.ruleWarnings)&&
                    <Card className="page-card">
                        <CardHeader 
                            avatar={<Avatar icon={<WarningIcon colour="red" large={true} />} backgroundColor='#fff' />}
                            title={<WarningsTitle 
                                allowSubmit={this.props.selection.allowSubmit}
                                ruleWarnings={this.props.selection.ruleWarnings}
                            />}
                            subtitle={<WarningsExplanation 
                                allowSubmit={this.props.selection.allowSubmit}
                                ruleWarnings={this.props.selection.ruleWarnings}
                            />}
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
                                optionIndexesById={this.props.options.indexesById}
                                options={this.props.options.options}
                                optionsSelectedIdsOrdered={this.props.optionsSelectedTableOrder}
                                removeButton={false}
                                //removeHandler={this.props.optionContainerHandlers.remove}
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