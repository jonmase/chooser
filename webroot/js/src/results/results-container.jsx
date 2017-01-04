import React from 'react';

import Snackbar from 'material-ui/Snackbar';

import ResultsTableByStudent from './results-table-student.jsx';
import ResultsTableByOption from './results-table-option.jsx';

import Container from '../elements/container.jsx';
import TopBar from '../elements/topbar.jsx';
import AppTitle from '../elements/app-title.jsx';
import Loader from '../elements/loader.jsx';
import SortWrapper from '../elements/wrappers/sort.jsx';

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
                    options: data.options,
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
            options: [],
            optionSort: {
                field: 'title',
                fieldType: 'text',
                direction: 'asc',
            },
            selections: [],
            selectionSort: {
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
    
    handleSort: function(table, field, fieldType) {
        if(table === 'option') {
            var sort = this.state.optionSort;
            var items = this.state.options;
        }
        else if(table === 'selection') {
            var sort = this.state.selectionSort;
            var items = this.state.selections;
        }
        
        var direction = 'asc';
        if(field === sort.field) {
            if(sort.direction === 'asc') {
                direction = 'desc';
            }
        }
        
        console.log("Sort " + table + " results by: " + field + "(" + fieldType + "); direction: " + direction);
        
        var sortedItems = this.props.sortHelper(items, field, fieldType, direction);
        
        var sortState = {
            field: field,
            fieldType: fieldType,
            direction: direction,
        };
        
        if(table === 'option') {
            this.setState({
                options: sortedItems,
                optionSort: sortState,
            })
        }
        else if(table === 'selection') {
            this.setState({
                selections: sortedItems,
                selectionSort: sortState,
            })
        }
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
                            sort={this.state.selectionSort}
                        />,
            },
            {
                key: "option",
                label: "Results by Option",
                content: (!this.state.loaded)?
                        <Loader />
                    :
                        <ResultsTableByOption
                            choice={this.props.choice}
                            instance={this.state.instance}
                            options={this.state.options}
                            resultsContainerHandlers={{
                                sort: this.handleSort,
                            }}
                            sort={this.state.optionSort}
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

module.exports = SortWrapper(ResultsContainer);