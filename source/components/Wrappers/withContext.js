/* eslint-disable */

import React from 'react';

export default function withContext({ Component, Context }) {
  return props => (
    <Context.Consumer>
      {context => {
        const finalProps = { ...context, ...props };
        return <Component {...finalProps} />;
      }}
    </Context.Consumer>
  );
}
