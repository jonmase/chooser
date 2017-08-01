import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';

import AppTitle from '../elements/app-title.jsx';
import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';
import FieldsWrapper from '../elements/wrappers/fields.jsx';

import OptionFilterForm from './option-filter-form.jsx';

var OptionFilterPage = React.createClass({
    getInitialState: function () {
        var initialState = {
            buttonsDisabled: false,
            canSubmit: false,
            filterButtonLabel: 'Filter',
        };
    
        return initialState;
    },
    
    enableSubmitButton: function () {
        this.setState({
            canSubmit: true,
        });
    },

    disableSubmitButton: function () {
        this.setState({
            canSubmit: false,
        });
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
    
    handleBackButtonClick: function() {
        if(this.props.action === 'filter_view') {
            this.props.optionContainerHandlers.backToView();
        }
        else if(this.props.action === 'filter_edit') {
            this.props.optionContainerHandlers.backToEdit();
        }
    },
    
    handleClear: function() {
        console.log("Clear all filter");
    },
    
    handleFilterButtonClick: function() {
        this.refs.filter.submit();
    },
    
    render: function() {
        var topbar = <TopBar 
            iconLeft={<TopBarBackButton onTouchTap={this.handleBackButtonClick} />}
            iconRight={
                <span>
                    <RaisedButton 
                        disabled={this.state.buttonsDisabled}
                        key="clear"
                        label="Clear"
                        onTouchTap={this.handleClear}
                        secondary={true}
                        style={{marginTop: '6px', marginRight: '12px'}}
                    />
                    <RaisedButton 
                        disabled={this.state.buttonsDisabled || !this.state.canSubmit}
                        key="submit"
                        label={this.state.filterButtonLabel}
                        onTouchTap={this.handleFilterButtonClick}
                        //primary={true}
                        style={{marginTop: '6px'}}
                        type="submit"
                    />
                </span>
            }
            title={<AppTitle subtitle="Filter Options" />}
        />;
        
        return (
            <Container topbar={topbar} title={null}>
                <Formsy.Form 
                    id="option_filter_form"
                    method="POST"
                    noValidate={true}
                    onValid={this.enableSubmitButton}
                    onInvalid={this.disableSubmitButton}
                    onValidSubmit={this.props.optionContainerHandlers.filter}
                    ref="filter"
                >
                    <OptionFilterForm
                        filters={this.getFilters()}
                    />
                </Formsy.Form>
            </Container>
        );
    }
});

module.exports = FieldsWrapper(OptionFilterPage);