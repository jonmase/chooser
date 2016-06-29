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
        
        //Remove or hide the fields that are not being used?
        var remove = (this.props.removeOrHide === 'remove')?true:false;
        
        var defaultsFields = [];
        if(!remove || defaults.code) {
            defaultsFields.push(
                <div className={defaults.code?((defaults.description && !defaults.title)?'section':''):'hidden'} key="code">
                    <CodeField />
                </div>
            );
        }
        if(!remove || defaults.title) {
            defaultsFields.push(
                <div className={defaults.title?(defaults.description?'section':''):'hidden'} key="title">
                    <TitleField />
                </div>
            );
        }
        if(!remove || defaults.description) {
            defaultsFields.push(
                <div className={defaults.description?'':'hidden'} key="description">
                    <DescriptionField />
                </div>
            );
        }
        if(!remove || defaults.min_places) {
            defaultsFields.push(
                <div className={defaults.min_places?'':'hidden'} key="min_places">
                    <MinPlacesField />
                </div>
            );
        }
        if(!remove || defaults.max_places) {
            defaultsFields.push(
                <div className={defaults.max_places?'':'hidden'} key="max_places">
                    <MaxPlacesField />
                </div>
            );
        }
        if(!remove || defaults.points) {
            defaultsFields.push(
                <div className={defaults.points?'':'hidden'} key="points">
                    <PointsField />
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