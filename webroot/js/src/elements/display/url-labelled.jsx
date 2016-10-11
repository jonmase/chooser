import React from 'react';

import Url from './url.jsx';

var UrlLabelled = React.createClass({
    render: function() {
        return (
            <p>
                <strong>{this.props.label}: </strong>
                <Url {...this.props} />
            </p>
        );
    }
});

module.exports = UrlLabelled;