import React from 'react';

import Checkbox from '../elements/fields/checkbox.jsx';
import DateTime from '../elements/fields/datetime.jsx';
import Radio from '../elements/fields/radio.jsx';
import RangeSlider from '../elements/fields/range-slider.jsx';

var OptionFilterForm = React.createClass({
    getInitialState: function () {
        var initialState = {};
    
        this.props.filters.numericalFields.map(function(field) {
            initialState[field.name] = [this.props.filters.values[field.name].min, this.props.filters.values[field.name].max];
        }, this);
        
        return initialState;
    },
    
    //Adjust right padding on slider to allow for overshoot of final label, which caused a horizontal scroll bar on the dialog
    getSliderRightPaddingAdjustment: function() {
        //Base this on the minimum difference between min and max for all the sliders
        var minDiff = null;

        this.props.filters.numericalFields.forEach(function(field) {
            var diff = this.props.filters.values[field.name].max - this.props.filters.values[field.name].min;
            
            if(minDiff === null || diff < minDiff) {
                minDiff = diff;
            }
        }, this);
        
        //Extra padding needs to be 100% divided by half the min difference, minus 4 as the slider allows a 5% gap either side
        var sliderRightPaddingAdjustment = (100/(minDiff*2) - 4) + '%';
        
        return sliderRightPaddingAdjustment;
    },
    
    render: function() {
        return (
            <div>
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
                
                {this.props.filters.numericalFields.map(function(field) {
                    if(this.props.filters.values[field.name].min !== null && this.props.filters.values[field.name].max !== null) {
                        return (
                            <RangeSlider
                                key={field.name}
                                label={field.label}
                                max={this.props.filters.values[field.name].max}
                                min={this.props.filters.values[field.name].min}
                                name={field.name}
                                rightPaddingAdjustment={this.getSliderRightPaddingAdjustment()}
                                section={true}
                            />
                        );
                    }
                }, this)}
                
                {this.props.filters.listFields.map(function(field) {
                    field.section = true;
                    
                    return (
                        <Checkbox
                            field={field}
                            key={field.name}
                        />
                    );
                })}
                
                {this.props.filters.dateTimeFields.map(function(field) {
                    field.section = true;
                    field.max = this.props.filters.values[field.name].max;
                    field.min = this.props.filters.values[field.name].min;
                    
                    var fromField = Object.assign({}, field);
                    fromField.label = "From";
                    fromField.value = {date: field.min};
                    var toField = Object.assign({}, field);
                    toField.label = "To";
                    toField.value = {date: field.max};

                    var time = field.type === 'datetime';
                    
                    return (
                        <div key={field.name}>
                            <label style={{fontSize: '125%'}}>
                                {field.label}
                            </label>
                            <div>
                                <DateTime
                                    field={fromField}
                                    time={time}
                                />
                            </div>
                            <div>
                                <DateTime
                                    field={toField}
                                    time={time}
                                />
                            </div>
                        </div>
                    );
                }, this)}
            </div>
        );
    }
});

module.exports = OptionFilterForm;