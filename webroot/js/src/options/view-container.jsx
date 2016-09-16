import React from 'react';
import update from 'react-addons-update';

import Card  from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText  from 'material-ui/Card/CardText';

import Snackbar from 'material-ui/Snackbar';

import OptionsTable from './option-table.jsx';

import ChooserTheme from '../elements/theme.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var styles = {
    cardText: {
        paddingTop: '0px',
    }
};
    
var ViewContainer = React.createClass({
    getInitialState: function () {
        var initialState = {
            options: this.props.options,
            optionIndexesById: this.props.optionIds,
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        return initialState;
    },
    
    handleAddFavourite: function() {
    
    },
    
    handleRemoveFavourite: function() {
    
    },
    
    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    updateOptionIndexesById: function(options) {
        var optionIndexesById = {};
        options.forEach(function(option, index) {
            optionIndexesById[option.id] = index;
        });
        
        this.setState({
            optionIndexesById: optionIndexesById,
        });
        //return optionIndexesById;
    },

    render: function() {
        var optionHandlers = {
        };
        
        var optionViewHandlers = {
            addFavourite: this.handleAddFavourite,
            removeFavourite: this.handleRemoveFavourite,
        };
        
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <Card 
                        className="page-card"
                        initiallyExpanded={true}
                    >
                        <CardHeader
                            title="Instructions"
                            actAsExpander={true}
                            showExpandableButton={true}
                        />
                        <CardText 
                            expandable={true}
                            style={styles.cardText}
                        >
                            Please select 4 projects for the options listed below.
                        </CardText>
                    </Card>
                    <OptionsTable
                        action={'view'}
                        state={this.state}
                        choice={this.props.choice}
                        optionViewHandlers={optionViewHandlers}
                    />
                    <Snackbar
                        open={this.state.snackbar.open}
                        message={this.state.snackbar.message}
                        autoHideDuration={3000}
                        onRequestClose={this.handleSnackbarClose}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
});

module.exports = ViewContainer;