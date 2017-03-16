import React from 'react';

import {Card, CardTitle, CardText, CardActions} from 'material-ui/Card';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton  from 'material-ui/FlatButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ChooserTheme from '../elements/theme.jsx';

var styles = {
    cardContainer: {
        display: 'inline-block',
        paddingBottom: '1rem'
    },
    card: {
        display: 'inline-block',
        width: '100%',
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
        var topbar = <TopBar 
            iconLeft={null}
            iconRight={null}
            title={<AppTitle subtitle={this.props.choice.name + ": Dashboard"} />}
        />;

        return (
            <Container topbar={topbar}>
                <div style={styles.root} className="row">
                    {this.props.sections.map(function(card) {
                        return (
                            <div className="col-xs-12 col-sm-6 col-md-4" style={styles.cardContainer} key={card.title}>
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
                                        {card.description}
                                    </CardText>
                                    <CardActions>
                                        {card.actions.map(function(action) {
                                            return (
                                                <FlatButton 
                                                    label={action.label} 
                                                    key={action.label} 
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
            </Container>
        );
    }
});

module.exports = SectionsCards;