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

var styles = {
    tableRowColumn: {
        whiteSpace: 'normal',
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
    
var OptionsTable = React.createClass({
    render: function() {
        var props = this.props;

        return (
            <div>
                <Card 
                    className="page-card"
                    //initiallyExpanded={true}
                >
                    <CardHeader
                        title="Options"
                        subtitle="View and Select Options"
                        //actAsExpander={true}
                        //showExpandableButton={true}
                    >
                        <div style={{float: 'right'}}>
                            {/*<SortUsers 
                                state={props.state}
                                handlers={props.sortUsersHandlers} 
                                titleStyle={styles.sortFilterTitles}
                            />&nbsp;
                            <FilterUsers
                                state={props.state} 
                                roleOptions={props.roleOptions} 
                                handlers={props.filterUsersHandlers} 
                                titleStyle={styles.sortFilterTitles}
                            />&nbsp;*/}
                        </div>
                    </CardHeader>
                    <CardText 
                        //expandable={true}
                        style={styles.cardText}
                    >
                        <Table
                            selectable={true}
                            multiSelectable={true}
                        >
                            <TableHeader
                                displaySelectAll={true}
                                enableSelectAll={true}
                            >
                                <TableRow>
                                    {(props.choice.use_code)?<TableHeaderColumn>Code</TableHeaderColumn>:""}
                                    {(props.choice.use_title)?<TableHeaderColumn>Title</TableHeaderColumn>:""}
                                    {(props.choice.use_min_places)?<TableHeaderColumn>Min. Places</TableHeaderColumn>:""}
                                    {(props.choice.use_max_places)?<TableHeaderColumn>Max. Places</TableHeaderColumn>:""}
                                    {(props.choice.use_points)?<TableHeaderColumn>Points</TableHeaderColumn>:""}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {props.state.options.map(function(option) {
                                    return (
                                        <TableRow 
                                            key={option.id} 
                                        >
                                            {(props.choice.use_code)?<TableRowColumn style={styles.tableRowColumn}>{option.code}</TableRowColumn>:""}
                                            {(props.choice.use_title)?<TableRowColumn style={styles.tableRowColumn}>{option.title}</TableRowColumn>:""}
                                            {(props.choice.use_min_places)?<TableRowColumn style={styles.tableRowColumn}>{option.min_places}</TableRowColumn>:""}
                                            {(props.choice.use_max_places)?<TableRowColumn style={styles.tableRowColumn}>{option.max_places}</TableRowColumn>:""}
                                            {(props.choice.use_points)?<TableRowColumn style={styles.tableRowColumn}>{option.points}</TableRowColumn>:""}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardText>
                </Card>
            </div>
        );
    }
});

module.exports = OptionsTable;