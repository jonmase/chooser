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
    
    render: function() {
        var topbar = <TopBar 
            dashboardUrl={this.props.dashboardUrl} 
            iconLeft="menu"
            iconRight={null}
            sections={this.props.sections} 
            title={<AppTitle subtitle={this.props.choice.name + ": Results"} />}
            zDepth={0}
        />;
        
        var loaderDiv = <div style={{padding: '20px'}}>
                            <Loader />
                        </div>;

        var tabs = {
            onChange: this.props.resultsContainerHandlers.tabChange,
            tabs: [
                {
                    content: (!this.props.loaded)?
                            loaderDiv
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
                            loaderDiv
                        :
                            <ResultsTableByOption
                                choice={this.props.choice}
                                optionDefaultFields={this.props.optionDefaultFields}
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
            value: this.props.tab,
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