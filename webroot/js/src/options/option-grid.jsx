import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';

import ExtraField from './extra-field-labelled.jsx';
import FavouriteButton from './option-favourite-button.jsx';
import FilterDialog from './option-filter-dialog.jsx';

import FieldsWrapper from '../elements/wrappers/fields.jsx';
import ExpandButton from '../elements/buttons/expand-button.jsx';
import FilterButton from '../elements/buttons/filter-button.jsx';
import SortMenu from '../elements/buttons/sort-menu.jsx';
import Text from '../elements/display/text-labelled.jsx';

//TODO: Sort out title styles, and keep these styles DRY
var styles = {
    cardText: {
        paddingTop: '0px',
    }
};

var sortSeparator = '_#';

var OptionsGrid = React.createClass({
    getInitialState: function () {
        var initialState = {
            filterDialogOpen: false,
            optionsSelectedIds: this.props.optionsSelectedTableOrder,
        };
        
        return initialState;
    },
    
    getDateTimeFields: function() {
        var dateTimeFields = [];    //Start with empty array - no default date time fields
        
        this.props.choice.extra_fields.forEach(function(field) {
            //If field is sortable, add it to the array of sortable fields
            if(field.type === 'date' || field.type === 'datetime') {
                dateTimeFields.push(field);
            }
        });
        
        return dateTimeFields;
    },
    
    //Expand button shown if using description or not all extra fields are sortable
    getExpandButtonShown: function() {
        return this.props.choice.use_description || !this.props.choice.extra_fields.every(function(field, index) {
                return field.sortable;
            });
    },
    
    //Favourite button shown if selection is enabled
    getFavouriteButtonShown: function() {
        //return this.props.selectionEnabled;
        return false;
    },
    
    getFilters: function() {
        var dateTimeFields = this.getDateTimeFields();
        var listFields = this.getListFields();
        var numericalFields = this.getNumericalFields();
        
        var values = this.getFilterValues(dateTimeFields, numericalFields);
    
        return {
            dateTimeFields: dateTimeFields,
            listFields: listFields,
            numericalFields: numericalFields,
            values: values,
        };
    },
    
    getFilterValues: function(dateTimeFields, numericalFields) {
        var filterValues = {};
        
        numericalFields.forEach(function(field) {
            //Set defaults to null
            var min = null;
            var max = null;
        
            this.props.options.options.forEach(function(option) {
                //Does this option have a value for this field
                if(option[field.name] !== undefined && option[field.name] !== null && option[field.name] !== "") {
                    if(min === null || option[field.name] < min) {
                        min = parseInt(option[field.name], 10);
                    }
                    if(max === null || option[field.name] > max) {
                        max = parseInt(option[field.name], 10);
                    }
                }
            });
            
            filterValues[field.name] = {
                min: min,
                max: max,
            }
        }, this);
    
        dateTimeFields.forEach(function(field) {
            //Set defaults to null
            var min = null;
            var max = null;
            
            this.props.options.options.forEach(function(option) {
                //Does this option have a value for this field
                if(option[field.name] !== undefined && option[field.name] !== null && option[field.name] !== "") {
                    var fieldDate = option[field.name].date
                    var date = new Date(fieldDate.year, fieldDate.month - 1, fieldDate.day);
                    if(min === null || date < min) {
                        min = date;
                    }
                    if(max === null || date > max) {
                        max = date;
                    }
                }
            });
            
            filterValues[field.name] = {
                min: min,
                max: max,
            }
        }, this);

        return filterValues;
    },
    
    getListFields: function() {
        var listFields = [];    //Start with empty array - no default list fields
        
        this.props.choice.extra_fields.forEach(function(field) {
            //If field is sortable, add it to the array of sortable fields
            if(field.type === 'list') {
                listFields.push(field);
            }
        });
        
        return listFields;
    },
    
    getNumericalDefaultFields: function() {
        return this.props.getDefaultFieldsForChoice(this.props.choice, null, ['number']);
    },
    
    getNumericalFields: function() {
        var numericalFields = this.getNumericalDefaultFields();
        
        this.props.choice.extra_fields.forEach(function(field) {
            //If field is sortable, add it to the array of sortable fields
            if(field.type === 'number') {
                numericalFields.push(field);
            }
        });
        
        return numericalFields;
    },
    
    getSortableFields: function() {
        var sortableFields = this.props.getDefaultFieldsForChoice(this.props.choice, ['description']); //Get defaults field for choice, except description
        
        this.props.choice.extra_fields.forEach(function(field, index) {
            //If field is sortable, add it to the array of sortable fields
            if(field.sortable) {
                sortableFields.push(
                    {
                        label: field.label,
                        type: field.type,
                        name: field.name,
                    }
                );
            }
        });
        
        return sortableFields;
    },
    
    getSortableExtraFields: function() {
        var sortableExtraFields = [];
        this.props.choice.extra_fields.forEach(function(field, index) {
            //If field is sortable, add it to the array of sortable extra fields
            if(field.sortable) {
                sortableExtraFields.push(index);
            }
        });
        
        return sortableExtraFields;
    },
    
    getSortMenuItems: function() {
        var sortableFields = this.getSortableFields();
        
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
        
        return sortMenuItems;
    },
    
    getSubtitle: function() {
        //return 'Choose options using the tick boxes. Shortlist them using the stars. Sort the options using the table headings. Review and submit your choices using the button in the top right. ';
        return 'Choose options using the tick boxes. Sort the options using the table headings. Review and submit your choices using the button in the top right.';
    },
    
    getTitle: function() {
        return 'Choose Options';
    },
    
    handleFilterDialogOpen() {
        this.setState({
            filterDialogOpen: true,
        });
    },
    
    handleFilterDialogClose() {
        this.setState({
            filterDialogOpen: false,
        });
    },
    
    handleFilterSubmit(filters) {
        console.log("Filter the options:");
        console.log(filters);
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
        return (
            <div>
                <Card 
                    className="page-card"
                >
                    <div style={{float: 'right', margin: '12px'}}>
                        <FilterButton
                            handleClick={this.handleFilterDialogOpen} 
                            tooltip="Filter Options"
                        />
                        <SortMenu 
                            handleChange={this.handleSort} 
                            items={this.getSortMenuItems()}
                            sortValue={(this.props.optionsSort.field + sortSeparator + this.props.optionsSort.fieldType + sortSeparator + this.props.optionsSort.direction)}
                            sortDirection={this.props.optionsSort.direction}
                            tooltip="Sort Options"
                        />
                    </div>
                    <CardHeader
                        title={this.getTitle()}
                        subtitle={this.getSubtitle()}
                        textStyle={{paddingRight: 0}}
                        style={{marginRight: '120px'}}
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
                                            <strong>{(this.props.choice.use_code?(option.code + ": "):"")}</strong>
                                            {option.title}
                                        </div>;
                                    
                                    if(this.getExpandButtonShown()) {
                                        var rightIconButton = 
                                            <ExpandButton
                                                handleClick={this.props.optionContainerHandlers.viewMore} 
                                                id={option.id}
                                                style={styles.actionsButtons}
                                                tooltip=""
                                            />;
                                    }
                                    
                                    var firstSecondaryTextItem = true;
                                
                                    return (
                                        <div key={option.id}>
                                            {index>0&&<Divider />}
                                            <ListItem
                                                leftCheckbox={this.props.selectionEnabled?<Checkbox checked={this.state.optionsSelectedIds.indexOf(option.id) > -1} onCheck={(e, checked) => {this.handleSelectOption(option.id, checked)}} />:null}
                                                primaryText={primaryText}
                                                rightIconButton={rightIconButton}
                                                secondaryText={
                                                    <div>
                                                        {this.getNumericalDefaultFields().map(function(field) {
                                                            var divider = "";
                                                            if(firstSecondaryTextItem) {
                                                                firstSecondaryTextItem = false;
                                                            }
                                                            else {
                                                                divider = " | ";
                                                            }
                                                            
                                                            return (
                                                                <span key={field.label}>
                                                                    {divider}
                                                                    <Text label={field.label} value={option[field.name]} />
                                                                </span>
                                                            );
                                                        }, this)}
                                                        {this.getSortableExtraFields().map(function(fieldIndex, index) {
                                                            var divider = "";
                                                            if(!firstSecondaryTextItem || index > 0) {
                                                                divider = " | ";
                                                            }
                                                            if(firstSecondaryTextItem) {
                                                                firstSecondaryTextItem = false;
                                                            }
                                                            
                                                            var field = this.props.choice.extra_fields[fieldIndex];
                                                                
                                                            return (
                                                                <span key={field.name}>
                                                                    {divider}
                                                                    <ExtraField 
                                                                        extra={field.extra}
                                                                        label={field.label}
                                                                        options={field.options}
                                                                        //field={field}
                                                                        type={field.type}
                                                                        value={option[field.name]}
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
                <FilterDialog
                    dialogOpen={this.state.filterDialogOpen}
                    filters={this.getFilters()}
                    handlers={{
                        dialogClose: this.handleFilterDialogClose,
                        submit: this.handleFilterSubmit,
                    }}
                />
            </div>
        );
    }
});

module.exports = FieldsWrapper(OptionsGrid);