import React from 'react';
import Dimensions from 'react-dimensions'

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

import OptionList from './option-list.jsx';
import Warnings from './selection-warnings.jsx';

var SelectionBasket = React.createClass({
    render: function() {
        return (
            <div>
                <Warnings
                    allowSubmit={this.props.selection.allowSubmit}
                    rules={this.props.rules}
                    ruleWarnings={this.props.selection.ruleWarnings}
                />
            
                <Paper rounded={false} zDepth={2} style={{padding: '16px', margin: '15px 0'}}>
                    <p style={{margin: 0}}>You have chosen the following options:</p>
                    {(this.props.optionsSelectedTableOrder.length > 0)?
                        <OptionList
                            action="view"
                            instance={this.props.instance}
                            optionIds={this.props.optionsSelectedTableOrder}
                            options={this.props.options}
                            removeButton={true}
                            removeHandler={this.props.optionContainerHandlers.remove}
                            useCode={this.props.useCode}
                        />
                    :
                        <p>No options chosen</p>
                    }
                </Paper>
            </div>
        );
    }
});

module.exports = Dimensions()(SelectionBasket);