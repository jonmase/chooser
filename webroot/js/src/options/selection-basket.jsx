import React from 'react';
import Dimensions from 'react-dimensions'

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';

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
                    <div>No options chosen</div>
                }
            </div>
        );
    }
});

module.exports = Dimensions()(SelectionBasket);