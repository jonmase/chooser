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
    render: function() {
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div style={styles.root} className="row">
                    {this.props.sections.map(function(card) {
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