import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import ResultsTable from './results-table.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';
import Loader from '../elements/loader.jsx';

var ResultsContainer = React.createClass({
    loadSelectionsFromServer: function() {
        var url = '../get-selections/' + this.props.choice.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    instance: data.choosingInstance,
                    selections: data.selections,
                    loaded: true,
                });
            }.bind(this),
                error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    
    getInitialState: function () {
        var initialState = {
            instance: [],
            loaded: false,
            selections: [],
            sort: {
                field: 'user.username',
                fieldType: 'text',
                direction: 'asc',
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
    
    handleSort: function(field, fieldType) {
        console.log("Sort results by: " + field + "(" + fieldType + "); direction: " + this.state.sort.direction);
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
                    {(!this.state.loaded)?
                        <Loader />
                    :
                        <ResultsTable 
                            resultsContainerHandlers={{
                                sort: this.handleSort,
                            }}
                            selections={this.state.selections}
                            sort={this.state.sort}
                        />
                    }
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