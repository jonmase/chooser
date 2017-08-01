import React from 'react';

import FlatButton from 'material-ui/FlatButton';

import FormsyDialog from '../elements/formsy-dialog.jsx';
import Radio from '../elements/fields/radio.jsx';
import RangeSlider from '../elements/fields/range-slider.jsx';

var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var OptionFilterDialog = React.createClass({
    getInitialState: function () {
        var initialState = {
            canSubmit: false,
        };
    
        this.props.numericalFields.map(function(field) {
            initialState[field.name] = [this.props.filterValues[field.name].min, this.props.filterValues[field.name].max];
        }, this);
        
        return initialState;
    },

    enableSubmitButton: function () {
        this.setState({
            canSubmit: true
        });
    },

    disableSubmitButton: function () {
        this.setState({
            canSubmit: false
        });
    },
    
    getMinDiff: function() {
        var minDiff = null;

        this.props.numericalFields.forEach(function(field) {
            var diff = this.props.filterValues[field.name].max - this.props.filterValues[field.name].min;
            
            if(minDiff === null || diff < minDiff) {
                minDiff = diff;
            }
        }, this);
        
        return minDiff;
    },
    
    handleClear: function() {
        console.log("Clear all filter");
    },
    
    render: function() {
        var actions = [
            <FlatButton
                key="cancel"
                label="Cancel"
                secondary={true}
                onTouchTap={this.props.handlers.dialogClose}
            />,
            <FlatButton
                key="clear"
                label="Clear"
                secondary={true}
                onTouchTap={this.handleClear}
            />,
            <FlatButton
                key="submit"
                label="Filter"
                primary={true}
                type="submit"
                disabled={!this.state.canSubmit}
            />,
        ];
        
        //Adjust right padding on slider to allow for overshoot of final label, which caused a horizontal scroll bar on the dialog
        //Base this on the minimum difference between min and max for all the sliders
        //Extra padding needs to be 100% divided by half the min difference, minus 4 as the slider allows a 5% gap either side
        var minDiff = this.getMinDiff();
        var sliderRightPaddingAdjustment = (100/(minDiff*2) - 4) + '%';
        
        return (
            <FormsyDialog
                actions={actions}
                contentStyle={customDialogStyle}
                dialogOnRequestClose={this.props.handlers.dialogClose}
                dialogOpen={this.props.dialogOpen}
                dialogTitle="Filter Options"
                formId="option_filter_form"
                formOnValid={this.enableSubmitButton}
                formOnInvalid={this.disableSubmitButton}
                formOnValidSubmit={this.props.handlers.submit}
            >
                <Radio 
                    field={{
                        instructions: "",
                        label: "Selected",
                        name: "selected",
                        options: [
                            {
                                label: "All",
                                value: "all",
                            },
                            {
                                label: "Selected only",
                                value: "selected",
                            },
                            {
                                label: "Unselected only",
                                value: "unselected",
                            },
                        ],
                        section: true,
                        value: "all",
                    }}
                />
                
                {/*<Radio 
                    field={{
                        instructions: "",
                        label: "Favourites",
                        name: "favourites",
                        options: [
                            {
                                label: "All",
                                value: "all",
                            },
                            {
                                label: "Favourites only",
                                value: "favourites",
                            },
                            {
                                label: "Non Favourites only",
                                value: "nonfavourites",
                            },
                        ],
                        section: true,
                        value: "all",
                    }}
                />*/}
                
                {this.props.numericalFields.map(function(field) {
                    if(this.props.filterValues[field.name].min !== null && this.props.filterValues[field.name].max !== null) {
                        return (
                            <RangeSlider
                                key={field.name}
                                label={field.label}
                                max={this.props.filterValues[field.name].max}
                                min={this.props.filterValues[field.name].min}
                                name={field.name}
                                rightPaddingAdjustment={sliderRightPaddingAdjustment}
                                section={true}
                            />
                        );
                    }
                }, this)}
                
                //All filterable field types - numerical, lists, date ranges
                
            </FormsyDialog>
        );
    }
});

module.exports = OptionFilterDialog;