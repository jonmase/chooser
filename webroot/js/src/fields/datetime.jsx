import React from 'react';

import FormsyDate from 'formsy-material-ui/lib/FormsyDate';
import FormsyTime from 'formsy-material-ui/lib/FormsyTime';

import FieldLabel from '../elements/label.jsx';

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
            var defaultTime = null;
            if(field.value && field.value.time) {
                //defaultTime = new Date(field.value.time);
                defaultTime = new Date(2016, 1, 1, field.value.time.hour, field.value.time.minute);
            }
            
            timeElement = 
                <div className={colClasses}>
                    <FormsyTime
                        //autoOk={true}
                        defaultTime={defaultTime}   //Should be object, but not sure the format
                        format='24hr'
                        hintText="Time"
                        name={field.name + '_time'}
                        //pedantic={true}
                        required={required}
                    />
                </div>;
        }
        
        var defaultDate = null;
        if(field.value && field.value.date) {
            //Create the date to pass to the datepicker (months start from 0 not 1)
            defaultDate = new Date(field.value.date.year, field.value.date.month - 1, field.value.date.day);
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
                            defaultDate={defaultDate}
                            hintText="Date"
                            name={field.name + '_date'}
                            required={required}
                            formatDate={function(date) {
                                var dateString = days[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
                                return dateString;
                            }}
                        />
                    </div>
                    {timeElement}
                </div>
            </div>
        );
    }
});

module.exports = DateTimeField;