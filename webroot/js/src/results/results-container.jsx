import React from 'react';
import update from 'immutability-helper';

import Formsy from 'formsy-react';

import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';
import Loader from '../elements/loader.jsx';

var ResultsContainer = React.createClass({
    loadSelectionsFromServer: function() {
        var url = '../get-seletions/' + this.props.choice.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    selections: {
                        selections: data.selections,
                        loaded: true,
                    },
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    
    getInitialState: function () {
        var initialState = {
            selections: {
                selections: [],
                loaded: false,
            },
            snackbar: {
                open: false,
                message: '',
            },
        };
        
        return initialState;
    },

    componentWillMount: function() {
        this.loadSelectionsFromServer();
    },
    
    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    render: function() {
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={null}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name} />}
        />;

        return (
            <Container topbar={topbar}>
                <h2 className="page-title">
                    {this.props.title}
                </h2>
                <div>
                    Results go here
                </div>
                <Snackbar
                    open={this.state.snackbar.open}
                    message={this.state.snackbar.message}
                    autoHideDuration={3000}
                    onRequestClose={this.handleSnackbarClose}
                />
            </Container>
        );
    }
});

module.exports = ResultsContainer;