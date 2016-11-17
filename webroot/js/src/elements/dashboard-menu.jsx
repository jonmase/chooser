import React from 'react';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

var DashboardMenu = React.createClass({
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
        return (
            <Drawer
                docked={false}
                width={250}
                open={this.props.open}
                onRequestChange={this.props.handlers.requestChange}
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
                            <MenuItem onTouchTap={this.handleSelect} key={id} id={id} data-section-index={sectionIndex} data-action-index={actionIndex}>
                                <FontIcon style={{top: '0.25em', marginRight: '5px'}} className="material-icons">{icon}</FontIcon>
                                {label}
                            </MenuItem>
                        );
                    }, this);
                }, this)}
            </Drawer>
        );
    }
});

module.exports = DashboardMenu;