import React from 'react';

export default function NotFound({text}) {
  return (
    <div className="container">
      <h1>Not Found</h1>
      <p>{!!text ? text : 'The page you requested does not exist'}</p>
    </div>
  );
}
