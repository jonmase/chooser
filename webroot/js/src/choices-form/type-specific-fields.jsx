import React from 'react';

import ListFields from './list-fields.jsx';
import NumberFields from './number-fields.jsx';

var TypeSpecificFields = React.createClass({
    render: function() {
        var extraValues = (this.props.values && typeof(this.props.values.extra) !== 'undefined')?this.props.values.extra:{};

        var typeSpecific = '';
        if(this.props.type === 'list') {
            typeSpecific = 
                <ListFields values={extraValues} />;
        }
        else if(this.props.type === 'number') {
            typeSpecific = 
                <NumberFields values={extraValues} />;
        }

        return (
            <div>{typeSpecific}</div>
        );
    }
});

module.exports = TypeSpecificFields;