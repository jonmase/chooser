import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';

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
import SortMenu from '../elements/buttons/sort-menu.jsx';
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
    
var sortSeparator = '_#';

var OptionsGrid = React.createClass({
    getInitialState: function () {
        var initialState = {
            optionsSelectedIds: this.props.optionsSelectedTableOrder,
        };
        
        return initialState;
    },
    
    _onRowSelection: function(selectedRows){
        this.props.optionContainerHandlers.selectOption(selectedRows);
    },
    
    handleSelectOption: function(optionId, checked) {
        var optionsSelectedIds = this.state.optionsSelectedIds.slice();
        
        var indexOfSelectedOption = optionsSelectedIds.indexOf(optionId);
        //If checkbox is checked and optionId is not already in the array, add it
        if(checked && indexOfSelectedOption === -1) {
            optionsSelectedIds.push(optionId);
        }
        //If checkbox is unchecked and optionId is in the array, remove it
        else if(!checked && indexOfSelectedOption > -1) {
            optionsSelectedIds.splice(indexOfSelectedOption, 1);
        }
    
        this.setState({
            optionsSelectedIds: optionsSelectedIds,
        }, this.props.optionContainerHandlers.selectOption(optionsSelectedIds));
    },
    
    handleSort: function(fieldValue) {
        var fieldValueSplit = fieldValue.split(sortSeparator);
        this.props.optionContainerHandlers.sort(fieldValueSplit[0], fieldValueSplit[1], fieldValueSplit[2]);
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
        
        var sortableFields = [];
        if(this.props.choice.use_code) {
            sortableFields.push(
                {
                    label: 'Code',
                    type: 'text',
                    name: 'code',
                }
            );
        }
        sortableFields.push(
            {
                label: 'Title',
                type: 'text',
                name: 'title',
            }
        );
        var minPlacesSortableField = {
            label: 'Min. Places',
            type: 'number',
            name: 'min_places',
        };
        var maxPlacesSortableField = {
            label: 'Max. Places',
            type: 'number',
            name: 'max_places',
        };
        
        var placesType = false;
        if(this.props.choice.use_min_places && this.props.choice.use_max_places) {
            placesType = 'both';
            sortableFields.push(minPlacesSortableField);
            sortableFields.push(maxPlacesSortableField);
        }
        else if(this.props.choice.use_min_places) {
            placesType = 'min';
            sortableFields.push(minPlacesSortableField);
        }
        else if(this.props.choice.use_max_places) {
            placesType = 'max';
            sortableFields.push(maxPlacesSortableField);
        }
        
        if(this.props.choice.use_points) {
            sortableFields.push(
                {
                    label: 'Points',
                    type: 'number',
                    name: 'points',
                }
            );
        }        
        
        var sortableExtraFields = [];
        var filterableExtraFields = [];
        
        this.props.choice.extra_fields.forEach(function(field, index) {
            //If field is sortable, add it to the array of sortable fields
            if(field.sortable) {
                sortableExtraFields.push(index);
                sortableFields.push(
                    {
                        label: field.label,
                        type: field.type,
                        name: field.name,
                    }
                );
            }
            //Otherwise, field will not be shown, so need to show expand button, if not already doing so
            else if(!showExpandColumn) {
                showExpandColumn = true;
            }
            if(field.filterable) {
                filterableExtraFields.push(index);
            }
        });
        
        var sortMenuItems = [];
        sortableFields.forEach(function(field) {
            var sortValueBase = field.name + sortSeparator + field.type + sortSeparator;
            
            var ascText = 'a...z';
            var descText = 'z...a';
            switch(field.type) {
                case 'date':
                case 'datetime':
                    ascText = 'old...new';
                    descText = 'new...old';
                    break;
                case 'number': 
                    ascText = 'low...high';
                    descText = 'high...low';
                    break;
                default:
                    break;
            }
            //var ascText = <FontIcon className="material-icons" style={{verticalAlign: 'text-bottom'}}>arrow_upward</FontIcon>;
            //var descText = <FontIcon className="material-icons" style={{verticalAlign: 'text-bottom'}}>arrow_downward</FontIcon>;
            
            sortMenuItems.push({
                value: sortValueBase + 'asc',
                label: <div>{field.label} - {ascText}</div>,
            });
            sortMenuItems.push({
                value: sortValueBase + 'desc',
                label: <div>{field.label} - {descText}</div>,
            });
        });

        
        return (
            <div>
                <Card 
                    className="page-card"
                >
                    <div style={{float: 'right', margin: '12px'}}>
                        <SortMenu 
                            handleChange={this.handleSort} 
                            items={sortMenuItems}
                            sortValue={(this.props.optionsSort.field + sortSeparator + this.props.optionsSort.fieldType + sortSeparator + this.props.optionsSort.direction)}
                            sortDirection={this.props.optionsSort.direction}
                            tooltip="Sort Options"
                        />
                    </div>
                    <CardHeader
                        title={title}
                        subtitle={subtitle}
                        textStyle={{paddingRight: 0}}
                        style={{marginRight: '72px'}}
                    >
                    </CardHeader>
                    <div style={{clear: 'both'}}></div>
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
                                            <strong>{(this.props.choice.useCode?(option.code + ": "):"")}</strong>
                                            {option.title}
                                        </div>;
                                    
                                    var placesText = "";
                                    if(placesType) {
                                        if(placesType = 'min') {
                                            placesText = <span><strong>Min. Places: </strong>{option.min_places} | </span>;
                                        }
                                        else if(placesType = 'max') {
                                            placesText = <span><strong>Max. Places: </strong>{option.max_places} | </span>;
                                        }
                                        else if(placesType = 'both') {
                                            placesText = <span><strong>Places: </strong>{option.min_places} - {option.max_places} | </span>;
                                        }
                                    }
                                    
                                    var pointsText = "";
                                    if(this.props.choice.use_points) {
                                        pointsText = <span><strong>Points: </strong>{option.points} | </span>;
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
                                                leftCheckbox={enableSelection&&<Checkbox checked={this.state.optionsSelectedIds.indexOf(option.id) > -1} onCheck={(e, checked) => {this.handleSelectOption(option.id, checked)}} />}
                                                primaryText={primaryText}
                                                rightIconButton={rightIconButton}
                                                secondaryText={
                                                    <div>
                                                        {placesText}
                                                        {pointsText}
                                                        {sortableExtraFields.map(function(fieldIndex, index) {
                                                           return (
                                                                <span key={fieldIndex}>
                                                                    {index > 0 && " | "}
                                                                    <ExtraField 
                                                                        extra={this.props.choice.extra_fields[fieldIndex].extra}
                                                                        label={this.props.choice.extra_fields[fieldIndex].label}
                                                                        options={this.props.choice.extra_fields[fieldIndex].options}
                                                                        //field={this.props.choice.extra_fields[fieldIndex]}
                                                                        type={this.props.choice.extra_fields[fieldIndex].type}
                                                                        value={option[this.props.choice.extra_fields[fieldIndex].name]}
                                                                    />
                                                                </span>
                                                           );
                                                        }, this)}
                                                    </div>
                                                }
                                                secondaryTextLines={1}
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