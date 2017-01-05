import React from 'react';

import ResultsIndex from './results-index.jsx';

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
            action: 'index',
            instance: [],
            loaded: false,
            options: [],
            optionBeingViewed: null,
            selections: [],
            selectionBeingViewed: null,
        };
        
        return initialState;
    },

    componentWillMount: function() {
        this.loadSelectionsFromServer();
    },
    
    goToIndex: function() {
        this.setState({
            action: 'index',
            optionBeingViewed: null,
            selectionBeingViewed: null,
        });
    },
    
    goToOptionView: function(id) {
        this.setState({
            action: 'option',
            optionBeingViewed: id,
        });
    },
    
    goToStudentView: function(id) {
        this.setState({
            action: 'student',
            selectionBeingViewed: id,
        });
    },
    
    handleSort: function(table, field, fieldType, direction) {
        console.log("Sort " + table + " results by: " + field + "(" + fieldType + "); direction: " + direction);
        
        if(table === 'option') {
            var items = this.state.options;
        }
        else if(table === 'selection') {
            var items = this.state.selections;
        }
        
        var sortedItems = this.props.sortHelper(items, field, fieldType, direction);
        
        if(table === 'option') {
            this.setState({
                options: sortedItems,
            })
        }
        else if(table === 'selection') {
            this.setState({
                selections: sortedItems,
            })
        }
    },

    render: function() {
        return (
            <div>
                {(this.state.action === 'index') &&
                    <ResultsIndex
                        loaded={this.state.loaded}
                        instance={this.state.instance}
                        options={this.state.options}
                        resultsContainerHandlers={{
                            goToOptionView: this.goToOptionView,
                            goToStudentView: this.goToStudentView,
                            sort: this.handleSort,
                        }}
                        selections={this.state.selections}
                        {...this.props}
                    />
                }
            </div>
        );
    }
});

module.exports = SortWrapper(ResultsContainer);