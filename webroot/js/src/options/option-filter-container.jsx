import React from 'react';

import FieldsWrapper from '../elements/wrappers/fields.jsx';

import OptionFilterPage from './option-filter-page.jsx';

var OptionFilterContainer = React.createClass({
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
        
            this.props.options.forEach(function(option) {
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
            
            this.props.options.forEach(function(option) {
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
    
    render: function() {
        return (
            <OptionFilterPage
                action={this.props.action}
                choosable={this.props.choosable}
                filters={this.getFilters()}
                optionContainerHandlers={this.props.optionContainerHandlers}
            />
        );
    }
});

module.exports = FieldsWrapper(OptionFilterContainer);