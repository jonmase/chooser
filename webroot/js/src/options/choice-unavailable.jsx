import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var ChoiceUnavailable = React.createClass({
    render: function() {
        var instance = this.props.instance.instance;
        
        return (
            <Card 
                className="page-card"
            >
                <CardHeader
                    title="Choice Unavailable"
                />
                <CardText 
                    style={styles.cardText}
                >
                    This Choice is currently unavailable. Please contact the staff responsible if you were expecting it to be available to you. 
                </CardText>
            </Card>
        );
    }
});

module.exports = ChoiceUnavailable;