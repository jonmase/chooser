var React = require('react');

var TextareaField = React.createClass({
    render: function() {
        return (
            <div className={this.props.section?'section':''}>
                <label>
                    {this.props.label}<br />
                    <span className="sublabel">{this.props.sublabel}</span>
                </label>
                <div>
                    <textarea rows={this.props.rows} name={this.props.name} style={{width: '100%'}} />
                </div>
            </div>
        );
    }
});

module.exports = TextareaField;