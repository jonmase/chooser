import React from 'react';

import ResultsIndex from './results-index.jsx';
import OptionResult from './option-result.jsx';
import StudentResult from './student-result.jsx';

import SortWrapper from '../elements/wrappers/sort.jsx';

var ResultsContainer = React.createClass({
    loadSelectionsFromServer: function() {
        var url = '../get-results/' + this.props.choice.id + '.json';
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    instance: data.choosingInstance,
                    options: data.options,
                    optionIndexesById: data.optionIndexesById,
                    selections: data.selections,
                    selectionIndexesById: data.selectionIndexesById,
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
            tab: 'student',
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
    
    goToOptionView: function(optionIndex) {
        this.setState({
            action: 'option',
            optionBeingViewedIndex: optionIndex,
        });
    },
    
    goToStudentView: function(selectionIndex) {
        this.setState({
            action: 'student',
            selectionBeingViewedIndex: selectionIndex,
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
        var itemIndexesById = this.props.updateIndexesByIdHelper(sortedItems);
        
        if(table === 'option') {
            this.setState({
                options: sortedItems,
                optionIndexesById: itemIndexesById,
            })
        }
        else if(table === 'selection') {
            this.setState({
                selections: sortedItems,
                selectionIndexesById: itemIndexesById,
            })
        }
    },

    handleTabChange: function(value) {
        this.setState({
            tab: value,
        })
    },

    render: function() {
        var optionDefaultFields = [];
        if(this.props.choice.use_code) {
            optionDefaultFields.push({
                name: 'code',
                label: 'Code',
                type: 'text',
            })
        }
        if(this.props.choice.use_title) {
            optionDefaultFields.push({
                name: 'title',
                label: 'Title',
                type: 'text',
            })
        }
        if(this.props.choice.use_min_places) {
            optionDefaultFields.push({
                name: 'min_places',
                label: 'Min. Places',
                type: 'number',
            })
        }
        if(this.props.choice.use_max_places) {
            optionDefaultFields.push({
                name: 'max_places',
                label: 'Max. Places',
                type: 'number',
            })
        }
        if(this.props.choice.use_points) {
            optionDefaultFields.push({
                name: 'points',
                label: 'Points',
                type: 'number',
            })
        }
    
        return (
            <div>
                {(this.state.action === 'index') &&
                    <ResultsIndex
                        loaded={this.state.loaded}
                        instance={this.state.instance}
                        optionDefaultFields={optionDefaultFields}
                        options={this.state.options}
                        resultsContainerHandlers={{
                            goToOptionView: this.goToOptionView,
                            goToStudentView: this.goToStudentView,
                            sort: this.handleSort,
                            tabChange: this.handleTabChange,
                        }}
                        selections={this.state.selections}
                        tab={this.state.tab}
                        {...this.props}
                    />
                }
                {(this.state.action === 'student') &&
                    <StudentResult
                        instance={this.state.instance}
                        options={this.state.options}
                        optionIndexesById={this.state.optionIndexesById}
                        resultsContainerHandlers={{
                            goToIndex: this.goToIndex,
                        }}
                        selection={this.state.selections[this.state.selectionBeingViewedIndex]}
                        {...this.props}
                    />
                }
                {(this.state.action === 'option') &&
                    <OptionResult
                        option={this.state.options[this.state.optionBeingViewedIndex]}
                        optionDefaultFields={optionDefaultFields}
                        resultsContainerHandlers={{
                            goToIndex: this.goToIndex,
                        }}
                        selections={this.state.selections}
                        selectionIndexesById={this.state.selectionIndexesById}
                        {...this.props}
                    />
                }
            </div>
        );
    }
});

module.exports = SortWrapper(ResultsContainer);