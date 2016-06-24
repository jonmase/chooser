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
    
        return (
            <div>
                <div className={defaults.code?((defaults.description && !defaults.title)?'section':''):'hidden'}>
                    <CodeField />
                </div>
                <div className={defaults.title?(defaults.description?'section':''):'hidden'}>
                    <TitleField />
                </div>
                <div className={defaults.description?'':'hidden'}>
                    <DescriptionField />
                </div>
                <div className={defaults.min_places?'':'hidden'}>
                    <MinPlacesField />
                </div>
                <div className={defaults.max_places?'':'hidden'}>
                    <MaxPlacesField />
                </div>
                <div className={defaults.points?'':'hidden'}>
                    <PointsField />
                </div>
            </div>
        );
    }
});

module.exports = DefaultFields;