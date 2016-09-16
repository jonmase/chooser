import React from 'react';
import Formsy from 'formsy-react';

const HiddenInput = React.createClass({

  // Add the Formsy Mixin
  mixins: [Formsy.Mixin],

  render() {
    return (
        <input
            type="hidden"
            name={this.props.name}
            value={this.getValue()}
        />
    );
  }
});

module.exports = HiddenInput;