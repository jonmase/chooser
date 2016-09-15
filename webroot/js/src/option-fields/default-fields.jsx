import React from 'react';
import CodeField from './code.jsx';
import TitleField from './title.jsx';
import DescriptionField from './description.jsx';
import MinPlacesField from './min_places.jsx';
import MaxPlacesField from './max_places.jsx';
import PointsField from './points.jsx';


var DefaultFields = React.createClass({
    render: function() {
        var defaults = this.props.defaults;
        var option = false;
        if(typeof(this.props.option) !== "undefined") {
            option = this.props.option;
        }
        
        //Remove or hide the fields that are not being used?
        var remove = (this.props.removeOrHide === 'remove')?true:false;
        
        var defaultsFields = [];
        if(!remove || defaults.code) {
            defaultsFields.push(
                <div className={defaults.code?((defaults.description && !defaults.title)?'section':''):'hidden'} key="code">
                    <CodeField value={option?option.code:""} />
                </div>
            );
        }
        if(!remove || defaults.title) {
            defaultsFields.push(
                <div className={defaults.title?(defaults.description?'section':''):'hidden'} key="title">
                    <TitleField value={option?option.title:""} />
                </div>
            );
        }
        if(!remove || defaults.description) {
            defaultsFields.push(
                <div className={defaults.description?'':'hidden'} key="description">
                    <DescriptionField value={option?option.description:""} onChange={this.props.onWysiwygChange} />
                </div>
            );
        }
        if(!remove || defaults.min_places) {
            defaultsFields.push(
                <div className={defaults.min_places?'':'hidden'} key="min_places">
                    <MinPlacesField value={option?option.min_places:""} />
                </div>
            );
        }
        if(!remove || defaults.max_places) {
            defaultsFields.push(
                <div className={defaults.max_places?'':'hidden'} key="max_places">
                    <MaxPlacesField value={option?option.max_places:""} />
                </div>
            );
        }
        if(!remove || defaults.points) {
            defaultsFields.push(
                <div className={defaults.points?'':'hidden'} key="points">
                    <PointsField value={option?option.points:""} />
                </div>
            );
        }
    
        return (
            <div>
                {defaultsFields.map(function(field) {
                    return(
                        field
                    );
                })}
            </div>
        );
    }
});

module.exports = DefaultFields;