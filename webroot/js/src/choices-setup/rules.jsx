import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import AddRule from './add-rule.jsx';
import RuleDialog from './rule-dialog.jsx';

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
                    actAsExpander={false}
                    showExpandableButton={false}
                >
                    <div style={{float: 'right'}}>
                        <AddRule
                            handlers={this.props.handlers}
                        />
                    </div>
                </CardHeader>
                <CardText 
                    expandable={true}
                >
                    <div>
                        Table? of rules
                    </div>
                </CardText>
                <RuleDialog
                    choice={this.props.choice}
                    handlers={this.props.handlers}
                    state={this.props.state}
                />
            </Card>
        );
    }
});

module.exports = Rules;