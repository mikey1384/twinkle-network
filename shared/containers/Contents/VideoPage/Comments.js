import React, { Component } from 'react';

export default class Comments extends Component {
  render() {
    return (
      <div className="row container-fluid">
        <div className="container-fluid">
          <div className="page-header">
            <h3>Comments</h3>
            <div className="container-fluid">
              <div className="row form-group">
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Post your thoughts here."
                  style={{
                    height: '92px',
                    overflowY: 'hidden'
                  }}>
                </textarea>
              </div>
              <div className="row">
                <button className="btn btn-default btn-sm">Submit</button>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <ul className="media-list">
              <li className="media">There are no comments, yet.</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
