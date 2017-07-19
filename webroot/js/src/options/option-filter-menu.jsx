import React from 'react';

function OptionTitle(props) {
    return (
        <h3 style={{marginTop: 0}}>
            {props.code && (props.code + ": ")}
            {props.title}
        </h3>
    );
}

module.exports = OptionTitle;