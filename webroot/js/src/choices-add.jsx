var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var TopBar = require('./elements/topbar.jsx');
var NewChoiceForm = require('./choices-add/new-choice-form.jsx');
var LinkChoiceForm = require('./choices-add/link-choice-form.jsx');

injectTapEventPlugin();

ReactDOM.render(<TopBar subtitle={false} />, document.getElementById('topbar'));
ReactDOM.render(<NewChoiceForm />, document.getElementById('new_choice_form'));
ReactDOM.render(<LinkChoiceForm data={data.adminChoicesList} />, document.getElementById('link_choice_form'));
