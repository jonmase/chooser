import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Slider, { Range } from 'rc-slider';
import {indigo500} from 'material-ui/styles/colors';


import FormsyDialog from '../elements/formsy-dialog.jsx';
import Radio from '../elements/fields/radio.jsx';

var customDialogStyle = {
    width: '95%',
    maxWidth: 'none',
};

var minDiff = null;

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
    
    getSliderMarks: function(field) {
        var min = this.props.filterValues[field].min;
        var max = this.props.filterValues[field].max;
        var diff = max - min;
        
        if(minDiff === null || diff < minDiff) {
            minDiff = diff;
        }
        
        var step = 1;
        
        if(diff > 10) {
            step = 2;
        }
        if(diff > 20) {
            step = 5;
        }
        if(diff > 50) {
            step = 10;
        }
        if(diff > 100) {
            step = 20;
        }
            
        var marks = {};
        for(var i = min; i <= max; i+= step) {
            marks[i] = i;
        };
        return marks;
    },
    
    handleClear: function() {
        console.log("Clear all filter");
    },
    
    handleSliderChange: function(field, value) {
        this.setState({[field]: value});
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
        //Extra padding needs to be 100% divided by half the min difference, minus 5 as the slider allows a 5% gap either side
        var sliderRightPaddingAdjustment = (100/(minDiff*2) - 5) + '%';
        
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
                            <div className="section" style={{paddingRight: sliderRightPaddingAdjustment}} key={field.name}>
                                <label>{field.label}: <span>{this.state[field.name][0]} to {this.state[field.name][1]}</span></label>
                                <Range 
                                    allowCross={true}
                                    marks={this.getSliderMarks(field.name)}
                                    max={this.props.filterValues[field.name].max}
                                    min={this.props.filterValues[field.name].min}
                                    onChange={(value) => { this.handleSliderChange(field.name, value)}} 
                                    trackStyle={[{backgroundColor: indigo500}]}
                                    handleStyle={[{borderColor: indigo500}, {borderColor: indigo500}]}
                                    activeDotStyle={{borderColor: indigo500}}
                                    value={this.state[field.name]}
                                />
                            </div>
                        );
                    }
                }, this)}
                
                //All filterable field types - numerical, lists, date ranges
                
            </FormsyDialog>
        );
    }
});

module.exports = OptionFilterDialog;