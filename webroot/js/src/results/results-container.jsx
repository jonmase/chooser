import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import ResultsTableByStudent from './results-table-student.jsx';
import ResultsTableByOption from './results-table-option.jsx';

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
            title={<AppTitle subtitle={this.props.choice.name + ": Results"} />}
            zDepth={0}
        />;

        var tabs = [
            {
                key: "student",
                label: "Results by Student",
                content: (!this.state.loaded)?
                        <Loader />
                    :
                        <ResultsTableByStudent 
                            resultsContainerHandlers={{
                                sort: this.handleSort,
                            }}
                            selections={this.state.selections}
                            sort={this.state.sort}
                        />,
            },
            {
                key: "option",
                label: "Results by Option",
                content: (!this.state.loaded)?
                        <Loader />
                    :
                        <ResultsTableByOption
                            resultsContainerHandlers={{
                                sort: this.handleSort,
                            }}
                            selections={this.state.selections}
                            sort={this.state.sort}
                        />,
            },
        ];
        
        return (
            <Container topbar={topbar} title={null} tabs={tabs} >
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