import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';

import AddButton from '../buttons/add-button.jsx';
import AddButtonRaised from '../buttons/add-button-raised.jsx';
import EditButton from '../buttons/edit-button.jsx';
import ExpandButton from '../buttons/expand-button.jsx';
import RuleEditDialog from './rule-edit-dialog.jsx';
import RuleViewDialog from './rule-view-dialog.jsx';

import Loader from '../elements/loader.jsx';

var styles = {
    tableRowColumn: {
        whiteSpace: 'normal',
    },
    actionsTableRowColumn: {
        whiteSpace: 'normal',
        width: '96px',
        paddingLeft: '12px',
        paddingRight: '12px',
        textAlign: 'right',
    },
    favouriteTableRowColumn: {
        whiteSpace: 'normal',
        width: '48px',
        paddingLeft: '12px',
        paddingRight: '12px',
    },
    sortFilterTitles: {
        verticalAlign: '30%', 
        display: 'inline-block', 
        fontWeight: '500',
        width: '120px',
    },
    cardText: {
        paddingTop: '0px',
    }
};
    
var Rules = React.createClass({
    getInitialState: function () {
        var initialState = {
            ruleBeingViewed: null,
            ruleViewDialogOpen: false,
        };
        
        return initialState;
    },
    handleDialogOpen: function(ruleId) {
        this.setState({
            ruleBeingViewed: ruleId,
            ruleViewDialogOpen: true,    //Open the dialog
        });
    },
    handleDialogClose: function() {
        this.setState({
            ruleBeingViewed: null,    //Clear the rule being viewed
            ruleViewDialogOpen: false,    //Close the dialog
        });
    },
    render: function() {
        var viewDialogHandlers = {
            dialogOpen: this.handleDialogOpen,
            dialogClose: this.handleDialogClose,
        };
    
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    title="Rules"
                    subtitle="Define the rules for making valid choices"
                    actAsExpander={false}
                    showExpandableButton={false}
                >
                    <div style={{float: 'right'}}>
                        <AddButton
                            handleAdd={this.props.handlers.dialogOpen}
                            tooltip="Add Rule"
                        />
                    </div>
                </CardHeader>
                <CardText 
                    expandable={true}
                >
                    {!this.props.containerState.rulesLoaded?
                        <Loader />
                    :
                        (this.props.containerState.rules.length === 0)?
                            <div>
                                <p>There are no rules yet.</p>
                                <AddButtonRaised handleAdd={this.props.handlers.dialogOpen} label="Add Rule" />
                            </div>
                        :
                            <Table 
                                //selectable={false}
                                multiSelectable={true}
                                //onRowSelection={this._onRowSelection}
                                //onCellClick={this.onCellClick}
                            >
                                <TableHeader 
                                    //adjustForCheckbox={false} 
                                    displaySelectAll={true}
                                >
                                    <TableRow>
                                        <TableHeaderColumn>Name</TableHeaderColumn>
                                        <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody 
                                    //displayRowCheckbox={false}
                                    deselectOnClickaway={false}
                                >
                                    {this.props.containerState.rules.map(function(rule) {
                                        return (
                                            <TableRow 
                                                key={rule.id} 
                                                //selected={this.props.state.optionssSelected.indexOf(user.username) !== -1}
                                            >
                                                <TableRowColumn style={styles.tableRowColumn}>{rule.name}</TableRowColumn>
                                                <TableRowColumn style={styles.actionsTableRowColumn}>
                                                    <EditButton
                                                        handlerEdit={this.props.handlers.dialogOpen} 
                                                        id={rule.id}
                                                        tooltip="Edit Option"
                                                    />
                                                    <ExpandButton
                                                        handlerMore={viewDialogHandlers.dialogOpen} 
                                                        id={rule.id}
                                                        tooltip="See More"
                                                    />
                                                </TableRowColumn>
                                            </TableRow>
                                        );
                                    }, this)}
                                </TableBody>
                            </Table>
                    }
                </CardText>
                <RuleEditDialog
                    handlers={this.props.handlers}
                    containerState={this.props.containerState}
                />
                <RuleViewDialog
                    handlers={viewDialogHandlers}
                    containerState={this.props.containerState}
                    rulesState={this.state}
                />
            </Card>
        );
    }
});

module.exports = Rules;