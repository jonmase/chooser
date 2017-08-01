import React from 'react';

import FormsyDate from 'formsy-material-ui/lib/FormsyDate';
import FormsyTime from 'formsy-material-ui/lib/FormsyTime';

import FieldLabel from './label.jsx';

var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var xs = 12;
var sm = 6;
var md = 4;
var lg = 3;
var colClasses = 'col-xs-' + xs + ' col-sm-' + sm + ' col-md-' + md + ' col-lg-' + lg
        
var DateTimeField = React.createClass({
    render: function() {
        var field = this.props.field;
        
        var required=field.required?true:false;
        
        var timeElement = '';
        if(this.props.time) {
            var timeValue = null;
            var timeDefaultValue = null;
            if(field.value && field.value.time) {
                //timeValue = new Date(field.value.time);
                timeValue = new Date(2016, 1, 1, field.value.time.hour, field.value.time.minute);
            }
            else if(field.defaultValue && field.defaultValue.time) {
                //timeDefaultValue = new Date(field.defaultValue.time);
                timeDefaultValue = new Date(2016, 1, 1, field.defaultValue.time.hour, field.defaultValue.time.minute);
            }
            
            timeElement = 
                <div className={colClasses}>
                    <FormsyTime
                        //autoOk={true}
                        defaultTime={timeDefaultValue}   //Should be object, but not sure the format
                        format='ampm'
                        hintText="Time"
                        name={field.name + '_time'}
                        onChange={field.onChange}
                        pedantic={true}
                        required={required}
                        value={timeValue}
                    />
                </div>;
        }
        
        var dateValue = null;
        var dateDefaultValue = null;
        if(field.value && field.value.date) {
            //If date object has getDate function, then it is a date object, so we can just use this
            if(typeof(field.value.date.getDate) === 'function') {
                dateValue = field.value.date;
            }
            //Otherwise assume that date object has year, month and day values
            else {
                //Create the date to pass to the datepicker (months start from 0 not 1)
                dateValue = new Date(field.value.date.year, field.value.date.month - 1, field.value.date.day);
            }
        }
        else if(field.defaultValue && field.defaultValue.date) {
            //If date object has getDate function, then it is a date object, so we can just use this
            if(typeof(field.defaultValue.date.getDate) === 'function') {
                dateDefaultValue = field.defaultValue.date;
            }
            //Otherwise assume that date object has year, month and day values
            else {
                //Create the date to pass to the datepicker (months start from 0 not 1)
                dateDefaultValue = new Date(field.defaultValue.date.year, field.defaultValue.date.month - 1, field.defaultValue.date.day);
            }
        }
        
        return (
            <div className={field.section?'section':''}>
                <FieldLabel
                    label={field.label}
                    instructions={field.instructions}
                />
                <div className="row">
                    <div className={colClasses}>
                        <FormsyDate
                            autoOk={true}
                            defaultDate={dateDefaultValue}
                            hintText="Date"
                            maxDate={field.max}
                            minDate={field.min}
                            name={field.name + '_date'}
                            onChange={field.onChange}
                            required={required}
                            formatDate={function(date) {
                                var dateString = days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
                                return dateString;
                            }}
                            value={dateValue}
                        />
                    </div>
                    {timeElement}
                </div>
            </div>
        );
    }
});

module.exports = DateTimeField;