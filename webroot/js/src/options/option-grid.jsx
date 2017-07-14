import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';

import ExtraField from './extra-field-labelled.jsx';
import WarningDialog from './option-unpublish-approved-warning-dialog.jsx';

import AddButton from '../elements/buttons/add-button.jsx';
import AddButtonRaised from '../elements/buttons/add-button-raised.jsx';
import ApprovalButton from '../elements/buttons/approval-button.jsx';
import DeleteButton from '../elements/buttons/delete-button.jsx';
import EditButton from '../elements/buttons/edit-button.jsx';
import ExpandButton from '../elements/buttons/expand-button.jsx';
import FavouriteButton from './option-favourite-button.jsx';
import PublishButton from '../elements/buttons/publish-button.jsx';
import RestoreButton from '../elements/buttons/restore-button.jsx';
import UnpublishButton from '../elements/buttons/unpublish-button.jsx';

import SortableTableHeaderColumn from '../elements/table/sortable-header.jsx';
import UnselectableCell from '../elements/table/unselectable-cell.jsx';

//TODO: Sort out title styles, and keep these styles DRY
var styles = {
    cardText: {
        paddingTop: '0px',
    }
};

styles.tableRowColumnTitle = Object.assign({}, styles.tableRowColumn, {minWidth: '30%'});
styles.publishedTableRowColumn = Object.assign({}, styles.tableRowColumn, {width: '72px', textAlign: 'center'});
styles.editorActionsTableRowColumn = Object.assign({}, styles.actionsTableRowColumn, {width: '144px'});
styles.approverActionsTableRowColumn = Object.assign({}, styles.actionsTableRowColumn, {width: '48px'});
styles.adminActionsTableRowColumn = Object.assign({}, styles.actionsTableRowColumn, {width: '192px'});
    
var OptionsGrid = React.createClass({
    getInitialState: function () {
        var initialState = {
            optionId: null,
        };
        
        return initialState;
    },
    
    _onRowSelection: function(selectedRows){
        this.props.optionContainerHandlers.selectOption(selectedRows);
    },

    render: function() {
        var title = 'Choose Options';
        //var subtitle = 'Choose options using the tick boxes. Shortlist them using the stars. Sort the options using the table headings. Review and submit your choices using the button in the top right. ';
        var subtitle = 'Choose options using the tick boxes. Sort the options using the table headings. Review and submit your choices using the button in the top right.';
        var enableSelection = this.props.instance.choosing.id?true:false;
        
        //Set visibility of favouritese, published, approved, expand and actions columns
        //var showFavouritesColumn = this.props.action === 'view' && enableSelection;
        var showFavouritesColumn = false;
        var showExpandColumn = this.props.choice.use_description;   //Initially set whether expand column should be shown based on whether description is used
        
        var placesType = false;
        if(this.props.choice.use_min_places && this.props.choice.use_max_places) {
            placesType = 'both';
        }
        else if(this.props.choice.use_min_places) {
            placesType = 'min';
        }
        else if(this.props.choice.use_max_places) {
            placesType = 'max';
        }
        
        var sortableExtraFields = [];
        var filterableExtraFields = [];
        
        this.props.choice.extra_fields.forEach(function(field, index) {
            //If field is sortable, add it to the array of sortable fields
            if(field.sortable) {
                sortableExtraFields.push(index);
            }
            //Otherwise, field will not be shown, so need to show expand button, if not already doing so
            else if(!showExpandColumn) {
                showExpandColumn = true;
            }
            if(field.filterable) {
                filterableExtraFields.push(index);
            }
        });
        
        return (
            <div>
                <Card 
                    className="page-card"
                >
                    <CardHeader
                        title={title}
                        subtitle={subtitle}
                        textStyle={{float: 'left'}}
                        style={{height: '72px'}}
                    />
                    <CardText 
                        style={styles.cardText}
                    >
                        {(this.props.options.options.length == 0)?
                            <p>There are no options to show.</p>
                        :
                            <List>
                                {this.props.options.options.map(function(option, index) {
                                    var primaryText = 
                                        <div style={{marginBottom: '5px'}}>
                                            {(this.props.choice.useCode?(option.code + ": "):"") + option.title}
                                        </div>;
                                    
                                    var defaultsText = "";
                                    if(placesType) {
                                        if(placesType = 'min') {
                                            defaultsText += "Min. Places: " + option.min_places;
                                        }
                                        else if(placesType = 'max') {
                                            defaultsText += "Max. Places: " + option.max_places;
                                        }
                                        else if(placesType = 'both') {
                                            defaultsText += "Places: " + option.min_places + " - " + option.max_places;
                                        }
                                        defaultsText += "; ";
                                    }
                                    if(this.props.choice.use_points) {
                                        defaultsText += "Points: " + option.points + "; "
                                    }
                                    
                                    var rightIconButton = 
                                        <ExpandButton
                                            handleClick={this.props.optionContainerHandlers.viewMore} 
                                            id={option.id}
                                            style={styles.actionsButtons}
                                            tooltip=""
                                        />;
                                
                                    return (
                                        <div key={option.id}>
                                            {index>0&&<Divider />}
                                            <ListItem
                                                leftCheckbox={enableSelection&&<Checkbox />}
                                                primaryText={primaryText}
                                                rightIconButton={rightIconButton}
                                                secondaryText={
                                                    <span>
                                                        <span>{defaultsText}</span>
                                                        {sortableExtraFields.map(function(fieldIndex) {
                                                           return (
                                                                <ExtraField 
                                                                    extra={this.props.choice.extra_fields[fieldIndex].extra}
                                                                    label={this.props.choice.extra_fields[fieldIndex].label}
                                                                    options={this.props.choice.extra_fields[fieldIndex].options}
                                                                    //field={this.props.choice.extra_fields[fieldIndex]}
                                                                    type={this.props.choice.extra_fields[fieldIndex].type}
                                                                    value={option[this.props.choice.extra_fields[fieldIndex].name]}
                                                                />
                                                           );
                                                        }, this)}
                                                    </span>
                                                }
                                            />
                                        </div>
                                    );                                
                                }, this)}
                            </List>
                        }
                    </CardText>
                </Card>
            </div>
        );
    }
});

module.exports = OptionsGrid;