import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import AddField from './add-field.jsx';

var ExtraFields = React.createClass({
    render: function() {
        return (
            <Card 
                className="page-card"
            >
                <CardHeader
                    title="Extra Fields"
                    subtitle="Add custom fields to the options form for this Choice"
                >
                    <div style={{float: 'right'}}>
                        <AddField 
                            state={this.props.state} 
                            handlers={this.props.handlers} 
                        />
                    </div>
                </CardHeader>
                <CardText>
                </CardText>
            </Card>
        );
    }
});

module.exports = ExtraFields;