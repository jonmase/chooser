import React from 'react';

import Card  from 'material-ui/Card/Card';
import CardTitle  from 'material-ui/Card/CardTitle';
import CardText  from 'material-ui/Card/CardText';
import CardActions  from 'material-ui/Card/CardActions';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton  from 'material-ui/FlatButton';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ChooserTheme from '../theme.jsx';

var styles = {
    cardContainer: {
        display: 'inline-block',
        paddingBottom: '1rem'
    },
    card: {
        display: 'inline-block',
    },
    cardTitle: {
        lineHeight: '30px !important',
    },
    cardTitleSpan: {
        fontSize: '20px',
        lineHeight: '30px',
    },
    icon: {
        fontSize: '30px',
        lineHeight: '30px',
        verticalAlign: '-25%',
        marginRight: '10px'
    },
    cardText: {
        height: '51px', //17px per line
        overflowY: 'hidden',
        //Replace bottom padding with margin, so overflow is hidden
        paddingBottom: '0px',
        marginBottom: '15px',
        
    },
};

var SectionsCards = React.createClass({
    getCardsData: function() {
        var cardsData = [
            {
                title: 'User Roles',
                icon: 'lock_open',  //icon: 'verified_user',//icon: 'block',
                actions: [
                    {
                        label: 'Edit',
                        url: '../roles/' + this.props.choiceId
                    }
                ],
                roles: ['admin'],
            },
            {
                title: 'Options Form',
                icon: 'playlist_add',   //icon: 'input',//icon: 'format_list_bulleted',//icon: 'reorder',
                actions: [
                    {
                        label: 'Edit',
                        url: '../form/' + this.props.choiceId
                    }
                ],
                roles: ['admin'],
            },
            {
                title: 'Editing Schedules',
                icon: 'mode_edit',
                actions: [
                    {
                        label: 'Edit',
                    },
                    {
                        label: 'New',
                    }
                ],
                roles: ['admin'],
            },
            {
                title: 'Notifications',
                icon: 'mail_outline',   //icon: 'announcement',//icon: 'priority_high',
                actions: [
                    {
                        label: 'Edit',
                    }
                ],
                roles: ['admin'],
            },
            {
                title: 'Profile',
                icon: 'perm_identity',  //icon: 'account_circle',
                actions: [
                    {
                        label: 'Edit',
                        url: '../../profile/' + this.props.choiceId,
                    }
                ],
                roles: ['admin', 'editor'],
            },
            {
                title: 'Options',
                icon: 'list',   //icon: 'view_list',//icon: 'format_list_numbered',
                actions: [
                    {
                        label: 'Edit Yours',
                    },
                    {
                        label: 'View All',
                    }
                ],
                roles: ['admin', 'editor', 'approver'],
            },
            {
                title: 'Choosing Schedules',
                icon: 'schedule',   //icon: 'timer',
                actions: [
                    {
                        label: 'Edit',
                    },
                    {
                        label: 'New',
                    }
                ],
                roles: ['admin'],
            },
            {
                title: 'Results',
                icon: 'equalizer',//icon: 'show_chart',//icon: 'insert_chart',
                actions: [
                    {
                        label: 'View',
                    },
                    {
                        label: 'Quick Download',
                    }
                ],
                roles: ['admin', 'reviewer', 'allocator'],
            },
            {
                title: 'Allocations',
                icon: 'compare_arrows',
                actions: [
                    {
                        label: 'View/Edit',
                    },
                    {
                        label: 'Quick Download',
                    }
                ],
                roles: ['admin', 'allocator'],
            },
        ];
        return cardsData;
    },
    
    getUserCards: function() {
        var cardsData = this.getCardsData();
        var userRoles = this.props.roles;
        var userCards = [];
        cardsData.forEach(function(card) {
            if(card.roles.some(function(cardRole) {
                return userRoles.indexOf(cardRole) > -1;
            })) {
                userCards.push(card);
            }
        });
        return userCards;
    },

    render: function() {
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div style={styles.root} className="row">
                    {this.getUserCards().map(function(card) {
                        return (
                            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" style={styles.cardContainer} key={card.title}>
                                <Card style={styles.card}>
                                    <CardTitle 
                                        title={
                                            <span style={styles.cardTitleSpan}>
                                                <FontIcon 
                                                    className="material-icons"
                                                    style={styles.icon}
                                                >
                                                    {card.icon}
                                                </FontIcon> 
                                                {card.title}
                                            </span>
                                        }
                                        style={styles.cardTitle}
                                    />
                                    <CardText style={styles.cardText}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                                        Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                                        Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                                    </CardText>
                                    <CardActions>
                                        {card.actions.map(function(action) {
                                            return (
                                                <FlatButton 
                                                    label={action.label} 
                                                    key={action.label} 
                                                    linkButton={true}
                                                    href={action.url} 
                                                />
                                            );
                                        })}
                                    </CardActions>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </MuiThemeProvider>
        );
    }
});

module.exports = SectionsCards;