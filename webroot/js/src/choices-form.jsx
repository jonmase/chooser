var React = require('react');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require('react-tap-event-plugin');
var TopBar = require('./elements/topbar.jsx');
var FormContainer = require('./choices-form/form-container.jsx');

injectTapEventPlugin();

ReactDOM.render(<TopBar subtitle={data.choice.name} />, document.getElementById('topbar'));
ReactDOM.render(
    <FormContainer 
        choice={data.choice} 
    />, 
    document.getElementById('form')
);
