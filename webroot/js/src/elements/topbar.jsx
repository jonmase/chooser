import React from 'react';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Badge from 'material-ui/Badge';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import Basket from '../options/selection-basket.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ChooserTheme from './theme.jsx';

var styles = {
  subtitle: {
    'fontSize': '80%',
    'marginLeft': '10px',
  },
};

var TopBar = React.createClass({
    getInitialState: function () {
        return {
            basketDrawerOpen: false,
            menuDrawerOpen: false,
        };
    },
    
    handleMenuDrawerToggle: function() {
        this.setState({menuDrawerOpen: !this.state.menuDrawerOpen});
    },
    
    handleBasketDrawerToggle: function() {
        this.setState({basketDrawerOpen: !this.state.basketDrawerOpen});
    },
    
    handleBasketDrawerRequestChange: function(basketDrawerOpen) {
        this.setState({basketDrawerOpen: basketDrawerOpen});
    },
    
    handleDashboardSelect: function(e) {
        var url = this.props.dashboardUrl;
        console.log(url);
        window.location.href = url;
    },
    
    handleSelect: function(e) {
        var sectionIndex = parseInt(e.currentTarget.dataset.sectionIndex);
        var actionIndex = parseInt(e.currentTarget.dataset.actionIndex);
    
        var url = this.props.sections[sectionIndex].actions[actionIndex].url;
        console.log(url);
        window.location.href = url;
    },
    
    render: function() {
        var menuDrawer = '';
        if(this.props.sections) {
            menuDrawer = <Drawer
                docked={false}
                width={250}
                open={this.state.menuDrawerOpen}
                onRequestChange={(menuDrawerOpen) => this.setState({menuDrawerOpen})}
            >
                <MenuItem onTouchTap={this.handleDashboardSelect} key="dashboard" id="dashboard"><h3 style={{margin: '10px 0 0'}}>Dashboard</h3></MenuItem>
                {this.props.sections.map(function(section, sectionIndex) {
                    return section.actions.map(function(action, actionIndex) {
                        var id = sectionIndex + "-" + actionIndex;
                        if(action.icon) {
                            var icon = action.icon;
                        }
                        else {
                            var icon = section.icon;
                        }
                        if(action.menuLabel) {
                            var label = action.menuLabel;
                        }
                        else {
                            var label = section.title;
                        }
                        
                        
                        return (
                            <MenuItem onTouchTap={this.handleSelect} key={id} id={id} data-section-index={sectionIndex} data-action-index={actionIndex}><FontIcon style={{top: '0.25em', marginRight: '5px'}} className="material-icons">{icon}</FontIcon>{label}</MenuItem>
                        );
                    }, this);
                }, this)}
            </Drawer>;
        }
        
        var iconElementRight=<span />;
        var basketDrawer='';
        if(this.props.showBasket) {
            var iconStyle={color: 'white'};
            iconElementRight=
                <div style={{paddingRight: '10px'}}>
                    {/*<IconButton
                        iconClassName="material-icons"
                        onTouchTap={this.props.handleInfoToggle}
                        iconStyle={iconStyle}
                    >
                        info_outline
                    </IconButton>*/}
                    <Badge
                        badgeContent={this.props.basket.optionsSelectedTableOrder.length || ""}
                        primary={true}
                        badgeStyle={{top: 0, right: -5, backgroundColor: 'none', fontSize: 16}}
                        style={{padding: 0}}
                    >
                        <IconButton
                            iconClassName="material-icons"
                            onTouchTap={this.handleBasketDrawerToggle}
                            iconStyle={iconStyle}
                        >
                            shopping_basket
                        </IconButton>
                    </Badge>
                </div>;
                
            basketDrawer = 
                <Basket
                    instance={this.props.basket.instance}
                    handlers={{
                        remove: this.props.basket.handlers.remove,
                        submit: this.props.basket.handlers.submit,
                        requestChange: this.handleBasketDrawerRequestChange,
                    }}
                    open={this.state.basketDrawerOpen}
                    options={this.props.basket.options}
                    optionsSelectedTableOrder={this.props.basket.optionsSelectedTableOrder}
                    rules={this.props.basket.rules}
                    selection={this.props.basket.selection}
                    useCode={this.props.choice.use_code}
                />
        }
    
        return (
            <MuiThemeProvider muiTheme={ChooserTheme}>
                <div>
                    <AppBar
                        title={<span>Chooser<span style={styles.subtitle}>{this.props.choice.name}</span></span>}
                        showMenuIconButton={this.props.menu?true:false}
                        onLeftIconButtonTouchTap={this.handleMenuDrawerToggle}
                        //onRightIconButtonTouchTap={this.handleBasketDrawerToggle}
                        //iconElementLeft={<IconButton><FontIcon className="material-icons">menu</FontIcon></IconButton>}
                        iconElementRight={iconElementRight}
                        style={{position: 'fixed'}}
                    />
                    {menuDrawer}
                    {basketDrawer}
                </div>
            </MuiThemeProvider>
        );
    }
});



module.exports = TopBar;