import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import ResultsTableByStudent from './results-table-student.jsx';
import ResultsTableByOption from './results-table-option.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';
import Loader from '../elements/loader.jsx';
import SortWrapper from '../elements/wrappers/sort.jsx';

var ResultsIndex = React.createClass({
    getInitialState: function () {
        var initialState = {
            snackbar: {
                open: false,
                message: '',
            },
            tab: 'student',
        };
        
        return initialState;
    },
    
    handleSnackbarClose: function() {
        this.setState({
            snackbar: {
                open: false,
                message: '',
            },
        });
    },
    
    handleTabChange: function(value) {
        this.setState({
            tab: value,
        })
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

        var tabs = {
            onChange: this.handleTabChange,
            tabs: [
                {
                    content: (!this.props.loaded)?
                            <Loader />
                        :
                            <ResultsTableByStudent 
                                handlers={{
                                    sort: this.props.resultsContainerHandlers.sort,
                                    view: this.props.resultsContainerHandlers.goToStudentView,
                                }}
                                selections={this.props.selections}
                            />,
                    label: "Results by Student",
                    value: "student",
                },
                {
                    content: (!this.props.loaded)?
                            <Loader />
                        :
                            <ResultsTableByOption
                                choice={this.props.choice}
                                instance={this.props.instance}
                                options={this.props.options}
                                handlers={{
                                    sort: this.props.resultsContainerHandlers.sort,
                                    view: this.props.resultsContainerHandlers.goToOptionView,
                                }}
                            />,
                    label: "Results by Option",
                    value: "option",
                },
            ],
            value: this.state.tab,
        };
        
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

module.exports = ResultsIndex;