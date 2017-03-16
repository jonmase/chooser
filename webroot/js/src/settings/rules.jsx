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
    cardText: {
        paddingTop: '0px',
    }
};
    
var Rules = React.createClass({
    getInitialState: function () {
        var initialState = {
            deleteButtonEnabled: true,
            deleteButtonLabel: 'Delete',
            deleteDialogOpen: false,
            ruleBeingDeleted: null,
        };
        
        return initialState;
    },
    
    handleDeleteDialogOpen: function(ruleIndex) {
        this.setState({
            deleteDialogOpen: true,
            ruleBeingDeleted: ruleIndex,
        });
    },
    handleDeleteDialogClose: function() {
        this.setState({
            deleteDialogOpen: false,
            ruleBeingDeleted: null,
        });
    },
    
    handleDelete: function(rule) {
        this.setState({
            deleteButtonEnabled: false,
            deleteButtonLabel: 'Deleting',
        });

        var rule = this.props.rules[this.state.ruleBeingDeleted];
        console.log("Deleting rule: ", rule);
        
        //Save the Rule
        var url = '../rules/delete/' + this.props.instance.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: rule,
            success: function(returnedData) {
                console.log(returnedData.response);

                this.setState({
                    deleteButtonEnabled: true,
                    deleteButtonLabel: 'Delete',
                    deleteDialogOpen: false,
                    ruleBeingDeleted: null,
                });
                
                this.props.handlers.success(returnedData);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
                
                this.setState({
                    deleteButtonEnabled: true,
                    deleteButtonLabel: 'Retry',
                });
                
                this.props.handlers.snackbarOpen('Save error (' + err.toString() + ')');
            }.bind(this)
        });
    },

    render: function() {
        var deleteDialogHandlers = {
            delete: this.handleDelete,
            dialogOpen: this.handleDeleteDialogOpen,
            dialogClose: this.handleDeleteDialogClose,
        };
    
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    title="Rules"
                    subtitle="The rules for making valid choices"
                    actAsExpander={false}
                    showExpandableButton={false}
                >
                    <div style={{float: 'right'}}>
                        {(this.props.instance.id)?
                            <AddButton
                                handleAdd={this.props.handlers.editButtonClick}
                                tooltip="Add Rule"
                            />
                        :""}
                    </div>
                </CardHeader>
                <CardText 
                    expandable={true}
                >
                    {(!this.props.instanceLoaded)?
                        //Show loader until both instance and rules have been loaded, as rules rely on instance
                        <Loader />
                    :
                        (!this.props.instance.id)?
                            <div>
                                <p style={{marginTop: 0}}>You cannot create rules until you have set up the Choice.</p>
                                <EditButtonRaised 
                                    handleEdit={this.props.handlers.settingsEditButtonClick} 
                                    id={null} 
                                    label="Set Up Choice"
                                />
                            </div>
                        :
                            (this.props.rules.length === 0)?
                                <div>
                                    <p style={{marginTop: 0}}>There are no rules yet.</p>
                                    <AddButtonRaised handleAdd={this.props.handlers.editButtonClick} label="Add Rule" />
                                </div>
                            :
                                <Table 
                                    selectable={false}
                                    //multiSelectable={true}
                                    //onRowSelection={this._onRowSelection}
                                    //onCellClick={this.onCellClick}
                                >
                                    <TableHeader 
                                        adjustForCheckbox={false} 
                                        displaySelectAll={false}
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
                                        displayRowCheckbox={false}
                                        //deselectOnClickaway={false}
                                    >
                                        {this.props.rules.map(function(rule, index) {
                                            return (
                                                <TableRow 
                                                    key={rule.id} 
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
                                                            handleMore={this.props.handlers.viewButtonClick} 
                                                            id={index}
                                                            tooltip=""
                                                        />
                                                        <EditButton
                                                            handleEdit={this.props.handlers.editButtonClick} 
                                                            id={index}
                                                            tooltip=""
                                                        />
                                                        <DeleteButton
                                                            handleDelete={this.handleDeleteDialogOpen} 
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
                <RuleDeleteDialog
                    handlers={deleteDialogHandlers}
                    deleteButtonEnabled={this.state.deleteButtonEnabled}
                    deleteButtonLabel={this.state.deleteButtonLabel}
                    deleteDialogOpen={this.state.deleteDialogOpen}
                    ruleBeingDeleted={this.state.ruleBeingDeleted}
                    rules={this.props.rules}
                />
            </Card>
        );
    }
});

module.exports = Rules;