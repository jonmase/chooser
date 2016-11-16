import React from 'react';
import Dimensions from 'react-dimensions'

import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';

import OptionList from './option-list.jsx';
import Warnings from './selection-warnings.jsx';

var SelectionBasket = React.createClass({
    closeDrawer: function() {
        this.props.handlers.requestChange(false);
    },
    render: function() {
        var width = 500;
        var iconElementLeft = null;
        var iconElementRight = null
        
        //if(this.props.containerWidth <= width) {
            width = this.props.containerWidth;
            iconElementLeft = <IconButton
                    iconClassName="material-icons"
                >
                    arrow_back
                </IconButton>;
            iconElementRight = <IconButton
                    iconClassName="material-icons"
                >
                    check
                </IconButton>;
        /*}
        if(this.props.containerWidth > (width*2)) {
            width = this.props.containerWidth/2;
            iconElementRight = <IconButton
                    iconClassName="material-icons"
                >
                    close
                </IconButton>;
        }*/
    
    
        return (
            <Drawer
                docked={false}
                width={width}
                onRequestChange={this.props.handlers.requestChange}
                open={this.props.open}
                openSecondary={true}
            > 
                <AppBar
                    title="Chosen Options"
                    showMenuIconButton={iconElementLeft?true:false}
                    onLeftIconButtonTouchTap={this.closeDrawer}
                    onRightIconButtonTouchTap={this.props.handlers.submit}
                    iconElementLeft={iconElementLeft}
                    iconElementRight={iconElementRight}
                />
                <div style={{padding: '0 15px 15px'}}>
                    {(this.props.optionsSelectedTableOrder.length > 0)?
                        <OptionList
                            action="view"
                            instance={this.props.instance}
                            optionIds={this.props.optionsSelectedTableOrder}
                            options={this.props.options}
                            removeButton={true}
                            removeHandler={this.props.handlers.remove}
                            useCode={this.props.useCode}
                        />
                    :
                        <div>No options chosen</div>
                    }
                
                    <Warnings
                        rules={this.props.rules}
                        ruleWarnings={this.props.selection.ruleWarnings}
                    />
                    
                    <div style={{marginTop: '15px'}}>
                        <RaisedButton
                            disabled={!this.props.selection.allowSubmit}
                            label="Submit"
                            onTouchTap={this.props.handlers.submit}
                            primary={true}
                        />
                    </div>
                </div>
            </Drawer>
        );
    }
});

module.exports = Dimensions()(SelectionBasket);