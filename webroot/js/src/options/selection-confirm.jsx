import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import Formsy from 'formsy-react';

import OptionList from './option-list.jsx';
import Warnings from './selection-warnings.jsx';
import EditableWarning from './selection-editable-warning.jsx';
import ConfirmDialog from './selection-confirm-dialog.jsx';

import MultilineField from '../elements/fields/multiline-text.jsx';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var SelectionConfirm = React.createClass({
    getInitialState: function () {
        var initialState = {
            canConfirm: true,
            confirmDialogOpen: false,
            //optionsSelectedOrdered: [],
            //rankSelectsDisabled: false,
        }
        
        return initialState;
    },
    //TODO: Not sure if componentWillMount is the right place to do this, but it works fine given that this component will never be shown when the page first loads
    /*componentWillMount: function() {
        //Clone the optionsSelected as optionsSelectedOrdered
        var optionsSelectedOrdered = this.props.selection.optionsSelected.slice(0);
        this.setState({
            optionsSelectedOrdered: optionsSelectedOrdered,
        });
    },*/
    
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
    
    handleConfirmDialogOpen() {
        this.setState({
            confirmDialogOpen: true,
        });
    },
    
    handleConfirmDialogClose() {
        this.setState({
            confirmDialogOpen: false,
        });
    },
    
    /*handleOrderChange: function(event, value, ignore, inputName) {
        //Prevent further changes to ranking during reordering
        this.setState({
            rankSelectsDisabled: true,
        });
        
        //Get the option ID from the input name (options.##.ranks)
        var splitInputName = inputName.split(".");
        //var optionId = parseInt(inputName.substr(6),10);    //Names are ranks.##
        var optionId = parseInt(splitInputName[1]);
        
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
    },*/
    
    handleConfirm: function(event, fromDialog) {
        //If not confirmed in the dialog, and not editable or there are warnings, open the dialog
        if(!fromDialog && (!this.props.instance.instance.editable || this.props.selection.ruleWarnings)) {
            this.handleConfirmDialogOpen();
        }
        //Otherwise, confirmed in the dialog, or editable and no warning, so submit the form
        else {
            this.refs.confirm.submit();
        }
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
                    <Formsy.Form
                        id="selection_confirm"
                        method="POST"
                        onValid={this.enableConfirmButton}
                        onInvalid={this.disableConfirmButton}
                        onValidSubmit={this.props.optionContainerHandlers.finalConfirm}
                        noValidate={true}
                        ref="confirm"
                    >
                        {(this.props.optionsSelectedPreferenceOrder.length > 0)?
                            <div style={{width: '100%'}}>
                                {/*<p>You have chosen the following options:</p>*/}
                                <OptionList
                                    action="confirm"
                                    handleOrderChange={this.props.optionContainerHandlers.orderChange}
                                    instance={this.props.instance.instance}
                                    optionIds={this.props.optionsSelectedPreferenceOrder}
                                    options={this.props.options}
                                    optionsSelected={this.props.optionsSelected}
                                    rankSelectsDisabled={this.props.rankSelectsDisabled}
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
                                name: "selection.comments",
                                onChange: this.props.optionContainerHandlers.overallCommentsChange,
                                section: true,
                                value: this.props.selection.selection.comments,
                            }} />
                        :""}
                        
                        <Warnings
                            rules={this.props.rules}
                            ruleWarnings={this.props.selection.ruleWarnings}
                        />
                        
                        <EditableWarning
                            instance={this.props.instance.instance}
                        />
                        
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
                                onTouchTap={this.handleConfirm}
                                primary={true}
                                //type="submit"
                            />
                        </div>
                    </Formsy.Form>
                    <ConfirmDialog 
                        open={this.state.confirmDialogOpen}
                        handlers={{
                            close: this.handleConfirmDialogClose,
                            submit: this.handleConfirm,
                        }}
                        instance={this.props.instance}
                        rules={this.props.rules}
                        selection={this.props.selection}
                    />
                </CardText>
            </Card>
        );
    }
});

module.exports = SelectionConfirm;