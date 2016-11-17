import React from 'react';

function AppTitle(props) {
  return <span>Chooser
            <span style={{
                'fontSize': '80%',
                'marginLeft': '10px',
            }}>
                {props.subtitle}
            </span>
      </span>;
}

module.exports = AppTitle;