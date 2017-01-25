import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';

var RolesExplanations = React.createClass({
    render: function() {
        var roles = [
            {
                title: 'Viewer',
                description: 'This is the basic role for students, or anyone making choices. Viewers can view the options that have been published (and, where applicable, approved), and make choices. Everyone who is able to access the Choice will have the Viewer role.',
            },
            {
                title: 'Editor',
                description: 'Editors can create and edit their own options. They can also create and edit their profile.',
            },
            {
                title: 'Approver',
                description: 'Approvers are only relevant in Choices that include an approval step. They can view all of the options that have been published by Editors, and can approve (or reject) these options, which then makes them available to the Viewers (subject to the Choice settings/schedule)',
            },
            {
                title: 'Reviewer',
                description: 'Reviewers can view and download the results for the Choice',
            },
            {
                title: 'Allocator',
                description: 'Allocators can view the results and allocate Viewers to options.',
            },
            {
                title: 'Administrator',
                description: 'Administrators have full control to do everything in a Choice.',
            },
        ]
    
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
                        {roles.map(function(role) {
                            return (
                                <div key={role.title}>
                                    <dt>{role.title}</dt>
                                    <dd>{role.description}</dd>
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
