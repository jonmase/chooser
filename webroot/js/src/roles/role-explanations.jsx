import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';

var RolesExplanations = React.createClass({
    render: function() {
        return (
            <Card 
                className="page-card"
                initiallyExpanded={false}
            >
                <CardHeader
                    title="Role Explanations"
                    subtitle="Descriptions of what each of the roles allows the user to do"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText 
                    expandable={true}
                    style={{paddingTop: '0px'}}
                >
                    <dl>
                        {this.props.roles.map(function(role) {
                            return (
                                <div key={role.title}>
                                    <dt>{role.title}</dt>
                                    <dd>{role.description.charAt(0).toUpperCase() + role.description.substr(1)}</dd>
                                </div>
                            );
                        })}
                    </dl>
                </CardText>
            </Card>
        );
    }
});

module.exports = RolesExplanations;
