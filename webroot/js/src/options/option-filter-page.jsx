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
    
    getInitialSelectedToggleValue: function () {
        if(typeof(this.props.activeFilters.selected) !== "undefined") {
            return this.props.activeFilters.selected;
        }
        return this.getDefaultSelectedToggleValue();
    },
    
    getInitialSliderValues: function () {
        var sliderValues = {};
        
        this.props.filters.numericalFields.map(function(field) {
            if(typeof(this.props.activeFilters[field.name]) !== "undefined") {
                sliderValues[field.name] = this.props.activeFilters[field.name].slice();
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
    },
    
    handleFilterButtonClick: function() {
        this.refs.filter.submit();
    },
    
    handleFilterSubmit: function(filters) {
        //Work out which filters are active
        var activeFilters = {};
        //var stateUpdates = {};
        
        //If choosing is enabled and selected filter is not set to all, the filter is active
        if(this.props.choosable && activeFilters.selected !== "all") {
            //stateUpdates.selectedValue = filters.selected;
            activeFilters.selected = filters.selected;
        }
        
        this.props.filters.numericalFields.map(function(field) {
            activeFilters[field.name] = this.state.sliderValues[field.name];
        }, this);
        
        //this.setState(stateUpdates);
        this.props.optionContainerHandlers.filter(activeFilters);
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