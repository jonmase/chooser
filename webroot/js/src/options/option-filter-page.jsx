import React from 'react';
import update from 'immutability-helper';

import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';

import AppTitle from '../elements/app-title.jsx';
import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import TopBarBackButton from '../elements/buttons/topbar-back-button.jsx';

import OptionFilterForm from './option-filter-form.jsx';

var OptionFilterPage = React.createClass({
    getInitialState: function () {
        var initialState = Object.assign({
            buttonsDisabled: false,
            canSubmit: false,
            filterButtonLabel: 'Filter',
        }, this.getInitialValues());
        
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
    
    //Default filter values are for the empty form
    getDefaultValues: function() {
        return {
            dateTimeValues: this.getDefaultDateTimeValues(),
            favouritesValue: this.getDefaultFavouritesToggleValue(),
            listValues: this.getDefaultListValues(),
            selectedValue: this.getDefaultSelectedToggleValue(),
            sliderValues: this.getDefaultAllSliderValues(),
        }
    },
    
    //Work out defaults for datetime fields
    getDefaultDateTimeValues: function () {
        var dateTimeValues = {};
        
        this.props.filters.dateTimeFields.map(function(field) {
            dateTimeValues[field.name] = {
                max: this.props.filters.values[field.name].max,
                min: this.props.filters.values[field.name].min,
            };
        }, this);
        
        return dateTimeValues;
    },

    //Defaults for favourites is show all
    getDefaultFavouritesToggleValue: function () {
        return "all";
    },
    
    getDefaultListValues: function () {
        var listValues = {};
        
        this.props.filters.listFields.map(function(field) {
            listValues[field.name] = {};
        });
        
        return listValues;
    },
    
    //Defaults for selected is show all
    getDefaultSelectedToggleValue: function () {
        return "all";
    },
    
    //Get defaults for all sliders
    getDefaultAllSliderValues: function () {
        var sliderValues = {};
        
        this.props.filters.numericalFields.map(function(field) {
            sliderValues[field.name] = this.getDefaultSliderValue(field.name);
        }, this);
        
        return sliderValues;
    },
    
    //Work out defaults for an individual slider
    getDefaultSliderValue: function (fieldName) {
        return [this.props.filters.values[fieldName].min, this.props.filters.values[fieldName].max]
    },
    
    //Initial filters values are based on activeFilters, falling back to defaults for inactive filters
    getInitialValues: function() {
        return {
            dateTimeValues: this.getInitialDateTimeValues(),
            favouritesValue: this.getInitialFavouritesToggleValue(),
            listValues: this.getInitialListValues(),
            selectedValue: this.getInitialSelectedToggleValue(),
            sliderValues: this.getInitialSliderValues(),
        }
    },
    
    getInitialDateTimeValues: function () {
        return this.getDefaultDateTimeValues();
    },

    getInitialFavouritesToggleValue: function () {
        if(typeof(this.props.activeFilters.favourites) !== "undefined") {
            return this.props.activeFilters.favourites;
        }
        return this.getDefaultFavouritesToggleValue();
    },
    
    getInitialListValues: function () {
        var listValues = {};
        
        this.props.filters.listFields.map(function(field) {
            if(typeof(this.props.activeFilters.list[field.name]) !== "undefined") {
                listValues[field.name] = this.props.activeFilters.list[field.name];
            }
            else {
                listValues[field.name] = {};
            }
        }, this);
        
        return listValues;
    },
    
    getInitialSelectedToggleValue: function () {
        if(typeof(this.props.activeFilters.selected) !== "undefined") {
            return this.props.activeFilters.selected;
        }
        return this.getDefaultSelectedToggleValue();
    },
    
    getInitialSliderValues: function () {
        var sliderValues = {};
        
        this.props.filters.numericalFields.map(function(field) {
            if(typeof(this.props.activeFilters.numeric[field.name]) !== "undefined") {
                sliderValues[field.name] = this.props.activeFilters.numeric[field.name].slice();
            }
            else {
                sliderValues[field.name] = this.getDefaultSliderValue(field.name);
            }
        }, this);
        
        return sliderValues;
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
        this.refs.filter.reset();
        
        this.setState(this.getDefaultValues());
        
        this.props.optionContainerHandlers.filter(false, false);
    },
    
    handleFilterButtonClick: function() {
        this.refs.filter.submit();
    },
    
    handleFilterSubmit: function(filterValues) {
        //Work out which filters are active
        var activeFilters = this.props.emptyActiveFilters;
        
        //If choosing is enabled and selected filter is not set to all, the filter is active
        if(this.props.choosable && filterValues.selected !== "all") {
            activeFilters.selected = filterValues.selected;
        }
        
        //Get the values for the numerical sliders and add these to active filters
        this.props.filters.numericalFields.map(function(field) {
            var stateSliderValues = this.state.sliderValues[field.name];
            //Only add to active filters if values are not at slider min and max
            if(stateSliderValues[0] > this.props.filters.values[field.name].min || stateSliderValues[1] < this.props.filters.values[field.name].max) {
                activeFilters.numeric[field.name] = stateSliderValues;
            }
        }, this);
        
        this.props.filters.listFields.map(function(field) {
            var countTrue = 0;
            var countFalse = 0;
            //var selectedValues = [];
        
            field.options.map(function(option) {
                if(filterValues[field.name][option.value]) {
                    countTrue++;
                    //selectedValues.push(option);
                }
                else {
                    countFalse++;
                }
            }, this);
            
            //If either of the counts is 0, all the options are selected or not selected so don't filter
            if(countTrue > 0 && countFalse > 0) {
                //If filtering, add the selected values to activeFilters
                activeFilters.list[field.name] = filterValues[field.name];
            }
        }, this);
        
        this.props.optionContainerHandlers.filter(activeFilters, true);
    },
    
    handleSliderChange: function(fieldName, value) {
        var sliderValuesState = this.state.sliderValues;
        var newSliderValuesState = update(sliderValuesState, {
            [fieldName]: {$set: value},
        });

        this.setState({
            sliderValues: newSliderValuesState,
        });
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
                    onValidSubmit={this.handleFilterSubmit}
                    ref="filter"
                >
                    <OptionFilterForm
                        choosable={this.props.choosable}
                        dateTimeValues={this.state.dateTimeValues}
                        favouritesValue={this.state.favouritesValue}
                        filters={this.props.filters}
                        listValues={this.state.listValues}
                        selectedValue={this.state.selectedValue}
                        sliderValues={this.state.sliderValues}
                        handlers={{
                            sliderChange: this.handleSliderChange,
                        }}
                    />
                </Formsy.Form>
            </Container>
        );
    }
});

module.exports = OptionFilterPage;