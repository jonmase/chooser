import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import Formsy from 'formsy-react';

import OptionList from './option-list.jsx';
import OptionWarnings from './option-warnings.jsx';

import Loader from '../elements/loader.jsx';
import DateTime from '../elements/display/datetime.jsx';

import MultilineField from '../elements/fields/multiline-text.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var OptionConfirm = React.createClass({
    getInitialState: function () {
        var initialState = {
            canConfirm: true,
            rankSelectsDisabled: false,
        }
        
        return initialState;
    },
    //TODO: Not sure if componentWillMount is the right place to do this, but it works fine given that this component will never be shown when the page first loads
    componentWillMount: function() {
        //Clone the optionsSelected as optionsSelectedOrdered
        var optionsSelectedOrdered = this.props.selection.optionsSelected.slice(0);
        this.setState({
            optionsSelectedOrdered: optionsSelectedOrdered,
        });
    },
    
    enableConfirmButton: function () {
        this.setState({
            canConfirm: true
        });
    },

    disableConfirmButton: function () {
        this.setState({
            canConfirm: false
        });
    },
    
    handleOrderChange: function(event, value, ignore, inputName) {
        //Prevent further changes to ranking during reordering
        this.setState({
            rankSelectsDisabled: true,
        });
        
        //Get the option ID from the input name
        var optionId = parseInt(inputName.substr(5),10);
        
        console.log(optionId + ": " + value);
        
        //Get the optionsSelectedOrdered array from state
        var optionsSelectedOrdered = this.state.optionsSelectedOrdered;
       
        //Remove this option from the ordered options array
        optionsSelectedOrdered.splice(optionsSelectedOrdered.indexOf(optionId),1);
        
        //Put this option back in the required position
        optionsSelectedOrdered.splice(value,0,optionId);
        
        console.log(optionsSelectedOrdered);
        
        this.setState({
            optionsSelectedOrdered: optionsSelectedOrdered,
            rankSelectsDisabled: false,
        });
    },
    
    render: function() {
        return (
            <Card 
                className="page-card"
                //initiallyExpanded={true}
            >
                <CardHeader
                    title="Confirm Options"
                    //actAsExpander={true}
                    //showExpandableButton={true}
                />
                <CardText 
                    //expandable={true}
                    style={styles.cardText}
                >
                    {(!this.props.options.loaded || !this.props.instance.loaded || !this.props.rules.loaded)?
                        <Loader />
                    :
                        <Formsy.Form
                            id="selection_confirm"
                            method="POST"
                            onValid={this.enableConfirmButton}
                            onInvalid={this.disableConfirmButton}
                            onValidSubmit={this.props.optionContainerHandlers.confirm}
                            noValidate={true}
                        >
                            {(this.state.optionsSelectedOrdered.length > 0)?
                                <div style={{width: '100%'}}>
                                    {/*<p>You have chosen the following options:</p>*/}
                                    <OptionList
                                        action={this.props.action}
                                        handleOrderChange={this.handleOrderChange}
                                        instance={this.props.instance.instance}
                                        optionIds={this.state.optionsSelectedOrdered}
                                        options={this.props.options}
                                        rankSelectsDisabled={this.state.rankSelectsDisabled}
                                        removeButton={false}
                                        useCode={this.props.choice.use_code}
                                    />
                                </div>
                            :
                                <div>No options chosen</div>
                            }
                            
                            {(this.props.instance.instance.comments_overall)?
                                <MultilineField field={{
                                    label: "Comments",
                                    instructions: this.props.instance.instance.comments_overall_instructions,
                                    name: "comments_overall",
                                    section: true,
                                    value: null,
                                }} />
                            :""}
                            
                            {(this.props.selection.ruleWarnings)?
                                <OptionWarnings
                                    rules={this.props.rules}
                                    ruleWarnings={this.props.selection.ruleWarnings}
                                />
                            :""}
                            
                            <p>
                                If you wish to go back and change the options you have chosen, select Change below. If you are happy with your choices, select Confirm.
                            </p>
                            <p>
                                <strong>Please Note: </strong>
                                {(this.props.instance.instance.editable)?
                                    <span>You will be able to return and change your choices until the deadline: <DateTime value={this.props.instance.instance.deadline} /></span>
                                :
                                    <span>Once you Confirm, you will not be able to change your choices.</span>
                                }
                            </p>
                            
                            <div style={{marginTop: '15px'}}>
                                <RaisedButton
                                    label="Change"
                                    onTouchTap={this.props.optionContainerHandlers.backToEdit}
                                    primary={false}
                                    style={{marginRight: '15px'}}
                                />
                                <RaisedButton
                                    disabled={!this.state.canConfirm}
                                    label="Confirm"
                                    onTouchTap={this.props.optionContainerHandlers.confirm}
                                    primary={true}
                                />
                            </div>
                        </Formsy.Form>
                    }
                </CardText>
            </Card>
        );
    }
});

module.exports = OptionConfirm;