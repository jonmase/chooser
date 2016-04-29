var React = require('react');
var Card  = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var CardText  = require('material-ui/lib/card/card-text');
var Formsy = require('formsy-react');
//var FormsyCheckbox = require('formsy-material-ui/lib/FormsyCheckbox');
var FormsyToggle = require('formsy-material-ui/lib/FormsyToggle');
var RaisedButton = require('material-ui/lib/raised-button');

var CodeField = require('../options-form/code.jsx');
var TitleField = require('../options-form/title.jsx');
var DescriptionField = require('../options-form/description.jsx');
var MinPlacesField = require('../options-form/min_places.jsx');
var MaxPlacesField = require('../options-form/max_places.jsx');
var PointsField = require('../options-form/points.jsx');

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
                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            <Formsy.Form
                                id="form_defaults_form"
                                method="POST"
                                onValidSubmit={this.props.handlers.submit}
                                //onChange={this.props.handlers.change}
                            >
                                <div className="section">
                                    <FormsyToggle
                                        label={<span>Code</span>}
                                        defaultToggled={this.props.choice.use_code}
                                        labelPosition="right"
                                        name="code"
                                        onChange={this.props.handlers.change}
                                    />
                                    <FormsyToggle
                                        label={<span>Title</span>}
                                        defaultToggled={this.props.choice.use_title}
                                        labelPosition="right"
                                        name="title"
                                        onChange={this.props.handlers.change}
                                    />
                                    <FormsyToggle
                                        label={<span>Description</span>}
                                        defaultToggled={this.props.choice.use_description}
                                        labelPosition="right"
                                        name="description"
                                        onChange={this.props.handlers.change}
                                    />
                                    <FormsyToggle
                                        label={<span>Min Places</span>}
                                        defaultToggled={this.props.choice.use_min_places}
                                        labelPosition="right"
                                        name="min_places"
                                        onChange={this.props.handlers.change}
                                    />
                                    <FormsyToggle
                                        label={<span>Max Places</span>}
                                        defaultToggled={this.props.choice.use_max_places}
                                        labelPosition="right"
                                        name="max_places"
                                        onChange={this.props.handlers.change}
                                    />
                                    <FormsyToggle
                                        label={<span>Points</span>}
                                        defaultToggled={this.props.choice.use_points}
                                        labelPosition="right"
                                        name="points"
                                        onChange={this.props.handlers.change}
                                    />
                                </div>
                                <RaisedButton 
                                    label={this.props.state.defaultsButton.label} 
                                    primary={true} 
                                    type="submit"
                                    disabled={this.props.state.defaultsButton.disabled}
                                />
                            </Formsy.Form>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <Formsy.Form
                                id="form_defaults_preview_form"
                                method="POST"
                            >
                                <div className={this.props.state.defaults.code?((this.props.state.defaults.description && !this.props.state.defaults.title)?'section':''):'hidden'}>
                                    <CodeField />
                                </div>
                                <div className={this.props.state.defaults.title?(this.props.state.defaults.description?'section':''):'hidden'}>
                                    <TitleField />
                                </div>
                                <div className={this.props.state.defaults.description?'':'hidden'}>
                                    <DescriptionField />
                                </div>
                                <div className={this.props.state.defaults.min_places?'':'hidden'}>
                                    <MinPlacesField />
                                </div>
                                <div className={this.props.state.defaults.max_places?'':'hidden'}>
                                    <MaxPlacesField />
                                </div>
                                <div className={this.props.state.defaults.points?'':'hidden'}>
                                    <PointsField />
                                </div>
                            </Formsy.Form>
                        </div>
                    </div>
                </CardText>
            </Card>
        );
    }
});

module.exports = DefaultFields;