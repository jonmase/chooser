import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Table, TableHeader, TableHeaderColumn, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';

import AddButton from '../elements/buttons/add-button.jsx';
import AddButtonRaised from '../elements/buttons/add-button-raised.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';
import EditButtonRaised from '../elements/buttons/edit-button-raised.jsx';
import DeleteButton from '../elements/buttons/delete-button.jsx';
import ExpandButton from '../elements/buttons/expand-button.jsx';

import RuleDeleteDialog from './rule-delete-dialog.jsx';
import RuleEditDialog from './rule-edit-dialog.jsx';
import RuleViewDialog from './rule-view-dialog.jsx';

import Loader from '../elements/loader.jsx';

var styles = {
    tableRowColumn: {
        whiteSpace: 'normal',
    },
    actionsTableRowColumn: {
        whiteSpace: 'normal',
        width: '144px',
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
    handleDialogOpen: function(ruleIndex) {
        this.setState({
            ruleBeingViewed: ruleIndex,
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
                        {(this.props.containerState.instance.id)?
                            <AddButton
                                handleAdd={this.props.handlers.editDialogOpen}
                                tooltip="Add Rule"
                            />
                        :""}
                    </div>
                </CardHeader>
                <CardText 
                    expandable={true}
                >
                    {(!this.props.containerState.instanceLoaded || !this.props.containerState.rulesLoaded)?
                        //Show loader until both instance and rules have been loaded, as rules rely on instance
                        <Loader />
                    :
                        (!this.props.containerState.instance.id)?
                            <div>
                                <p>You cannot create rules until you have set up the Choice.</p>
                                <EditButtonRaised 
                                    handleEdit={this.props.handlers.settingsDialogOpen} 
                                    id={null} 
                                    label="Set Up Choice"
                                />
                            </div>
                        :
                            (this.props.containerState.rules.length === 0)?
                                <div>
                                    <p>There are no rules yet.</p>
                                    <AddButtonRaised handleAdd={this.props.handlers.editDialogOpen} label="Add Rule" />
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
                                            <TableHeaderColumn>Type</TableHeaderColumn>
                                            <TableHeaderColumn>Allowed Values</TableHeaderColumn>
                                            <TableHeaderColumn>Applies To</TableHeaderColumn>
                                            <TableHeaderColumn>Hard</TableHeaderColumn>
                                            <TableHeaderColumn style={styles.actionsTableRowColumn}></TableHeaderColumn>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody 
                                        //displayRowCheckbox={false}
                                        deselectOnClickaway={false}
                                    >
                                        {this.props.containerState.rules.map(function(rule, index) {
                                            return (
                                                <TableRow 
                                                    key={rule.id} 
                                                    //selected={this.props.state.optionssSelected.indexOf(user.username) !== -1}
                                                >
                                                    <TableRowColumn style={styles.tableRowColumn}>{rule.name}</TableRowColumn>
                                                    <TableRowColumn style={styles.tableRowColumn}>{rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}</TableRowColumn>
                                                    <TableRowColumn style={styles.tableRowColumn}>{rule.values}</TableRowColumn>
                                                    <TableRowColumn style={styles.tableRowColumn}>{rule.scope_text}</TableRowColumn>
                                                    <TableRowColumn style={styles.tableRowColumn}>{rule.hard?
                                                        <FontIcon className="material-icons" style={{marginTop: '-2px'}}>check</FontIcon>
                                                        :
                                                        <FontIcon className="material-icons" style={{marginTop: '-1px'}}>close</FontIcon>
                                                    }</TableRowColumn>
                                                    <TableRowColumn style={styles.actionsTableRowColumn}>
                                                        <ExpandButton
                                                            handleMore={viewDialogHandlers.dialogOpen} 
                                                            id={index}
                                                            tooltip=""
                                                        />
                                                        <EditButton
                                                            handleEdit={this.props.handlers.editDialogOpen} 
                                                            id={index}
                                                            tooltip=""
                                                        />
                                                        <DeleteButton
                                                            handleDelete={this.props.handlers.deleteDialogOpen} 
                                                            id={index}
                                                            tooltip=""
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
                <RuleDeleteDialog
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