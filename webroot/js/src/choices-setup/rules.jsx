import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

var Rules = React.createClass({
    render: function() {
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    title="Rules"
                    subtitle="Define the rules for making valid choices"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText 
                    expandable={true}
                >
                    <div>
                        Table? of rules
                    </div>
                </CardText>
            </Card>
        );
    }
});

module.exports = Rules;