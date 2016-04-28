var React = require('react');
var Card  = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var CardText  = require('material-ui/lib/card/card-text');
var Formsy = require('formsy-react');
//var FormsyCheckbox = require('formsy-material-ui/lib/FormsyCheckbox');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var RaisedButton = require('material-ui/lib/raised-button');

var GetMuiTheme = require('material-ui/lib/styles/getMuiTheme');
var ChooserTheme = require('../theme.jsx');

var DefaultFields = React.createClass({
    //Apply Custom theme - see http://www.material-ui.com/#/customization/themes
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },
    getChildContext: function() {
        return {
            muiTheme: GetMuiTheme(ChooserTheme),
        };
    },
    render: function() {
        return (
            <Card 
                className="page-card"
                initiallyExpanded={true}
            >
                <CardHeader
                    title="Default Fields"
                    subtitle="Change which of the default fields are used for this Choice"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText 
                    expandable={true}
                >
                    <Formsy.Form
                        id="roles_settings_form"
                        method="POST"
                        onValidSubmit={this.props.handlers.submit}
                        onChange={this.props.handlers.change}
                    >
                        <div className="row section">
                            <div className="col-xs-12 col-sm-6">
                                <FormsyToggle
                                    label={<span>Code</span>}
                                    defaultToggled={this.props.state.defaults.code}
                                    labelPosition="right"
                                    name="code"
                                />
                                <FormsyToggle
                                    label={<span>Title</span>}
                                    defaultToggled={this.props.state.defaults.title}
                                    labelPosition="right"
                                    name="title"
                                />
                                <FormsyToggle
                                    label={<span>Description</span>}
                                    defaultToggled={this.props.state.defaults.description}
                                    labelPosition="right"
                                    name="description"
                                />
                            </div>
                            <div className="col-xs-12 col-sm-6">
                                <FormsyToggle
                                    label={<span>Min Places</span>}
                                    defaultToggled={this.props.state.defaults.min_places}
                                    labelPosition="right"
                                    name="min_places"
                                />
                                <FormsyToggle
                                    label={<span>Max Places</span>}
                                    defaultToggled={this.props.state.defaults.max_places}
                                    labelPosition="right"
                                    name="max_places"
                                />
                                <FormsyToggle
                                    label={<span>Points</span>}
                                    defaultToggled={this.props.state.defaults.points}
                                    labelPosition="right"
                                    name="points"
                                />
                            </div>
                        </div>
                        <RaisedButton 
                            label={this.props.state.defaultsButton.label} 
                            primary={true} 
                            type="submit"
                            disabled={this.props.state.defaultsButton.disabled}
                        />
                    </Formsy.Form>
                </CardText>
            </Card>
        );
    }
});

module.exports = DefaultFields;