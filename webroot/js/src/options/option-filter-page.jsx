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
    
    getInitialValues: function() {
        return {
            dateTimeValues: this.getInitialDateTimeValues(),
            favouritesValue: this.getInitialFavouritesToggleValue(),
            selectedValue: this.getInitialSelectedToggleValue(),
            sliderValues: this.getInitialSliderValues(),
        }
    },
    
    getInitialDateTimeValues: function () {
        var dateTimeValues = {};
        
        this.props.filters.dateTimeFields.map(function(field) {
            dateTimeValues[field.name] = {
                max: this.props.filters.values[field.name].max,
                min: this.props.filters.values[field.name].min,
            };
        }, this);
        
        return dateTimeValues;
    },

    getInitialFavouritesToggleValue: function () {
        return "all";
    },
    
    getInitialSelectedToggleValue: function () {
        return "all";
    },
    
    getInitialSliderValues: function () {
        var sliderValues = {};
        
        this.props.filters.numericalFields.map(function(field) {
            sliderValues[field.name] = [this.props.filters.values[field.name].min, this.props.filters.values[field.name].max];
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
        
        this.setState(this.getInitialValues());
    },
    
    handleFilterButtonClick: function() {
        
    
        this.refs.filter.submit();
    },
    
    handleFilterSubmit: function(filters) {
        //Work out which filters are active
        var activeFilters = {};
        var stateUpdates = {};
        
        if(this.props.choosable) {
            stateUpdates.selectedValue = filters.selected;
            if(filters.selected === "selected") {
                activeFilters.selected = true;
            }
            else {
                activeFilters.selected = false;
            }
        }
        
        this.setState(stateUpdates);
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