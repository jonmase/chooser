import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';
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
        }
        
        return initialState;
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
                    {(!this.props.containerState.optionsLoaded || !this.props.containerState.instanceLoaded || !this.props.containerState.rulesLoaded)?
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
                            <p>You have chosen the following options:</p>
                            {(this.props.containerState.optionsSelected.length > 0)?
                                <OptionList
                                    containerState={this.props.containerState}
                                    deleteButton={false}
                                    useCode={this.props.choice.use_code}
                                />
                            :
                                <div>No options chosen</div>
                            }
                            {(this.props.containerState.instance.comments_overall)?
                                <MultilineField field={{
                                    label: "Comments",
                                    instructions: this.props.containerState.instance.comments_overall_instructions,
                                    name: "comments_overall",
                                    section: true,
                                    value: null, //this.props.containerState.comments_overall,
                                }} />
                            :""}
                            
                            
                            {(this.props.containerState.ruleWarnings)?
                                <OptionWarnings
                                    containerState={this.props.containerState}
                                />
                            :""}
                            
                            <p>
                                If you wish to go back and change the options you have chosen, select Change below. If you are happy with your choices, select Confirm.
                            </p>
                            <p>
                                <strong>Please Note: </strong>
                                {(this.props.containerState.instance.editable)?
                                    <span>You will be able to return and change your choices until the deadline: <DateTime value={this.props.containerState.instance.deadline} /></span>
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