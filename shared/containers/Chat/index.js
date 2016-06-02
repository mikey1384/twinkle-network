import React, { Component } from 'react';

export default class Chat extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex'
        }}
      >
        <div className="col-sm-3">
          <div
            className="row flexbox-container"
            style={{
              marginBottom: '1em',
              paddingBottom: '0.5em',
              borderBottom: '1px solid #eee'
            }}
          >
            <div className="text-center col-sm-12 col-sm-offset-2">
              <h4>Channels</h4>
            </div>
            <button className="btn btn-default btn-sm pull-right">+ New</button>
          </div>
          <div className="row container-fluid">
            <input
              className="form-control"
              placeholder="Search for channels"
            />
          </div>
          <div className="row container-fluid">
            <div class="media">
              <br />
              <div className="media-body">
                <h4 className="media-heading">General</h4>
                <small>So this is what we talked about</small>
              </div>
            </div>
            <div class="media">
              <hr />
              <div className="media-body">
                <h4 className="media-heading">Programming Class</h4>
                <small>So this is what we talked about</small>
              </div>
            </div>
            <div class="media">
              <hr />
              <div className="media-body">
                <h4 className="media-heading">Harry, Sonic, Brandon</h4>
                <small>So this is what we talked about</small>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-sm-9"
          style={{
            height: '100%',
            top: 0,
            position: 'absolute'
          }}
        >
          <div
            style={{
              top: '60px',
              bottom: '50px',
              position: 'absolute',
              width: '95%',
              border: '1px red solid'
            }}
          >
            <div className="media">
              <div className="media-left">
                <a><img className="media-object" style={{width: '64px'}} src="/img/default.jpg"/></a>
              </div>
              <div className="media-body">
                <h5 className="media-heading">sonic</h5>hi guys my name is sonic
              </div>
            </div>
            <div className="media">
              <div className="media-left">
                <a><img className="media-object" style={{width: '64px'}} src="/img/default.jpg"/></a>
              </div>
              <div className="media-body">
                <h5 className="media-heading">sonic</h5>hi guys my name is sonic
              </div>
            </div>
            <div className="media">
              <div className="media-left">
                <a><img className="media-object" style={{width: '64px'}} src="/img/default.jpg"/></a>
              </div>
              <div className="media-body">
                <h5 className="media-heading">sonic</h5>hi guys my name is sonic
              </div>
            </div>
            <div className="media">
              <div className="media-left">
                <a><img className="media-object" style={{width: '64px'}} src="/img/default.jpg"/></a>
              </div>
              <div className="media-body">
                <h5 className="media-heading">sonic</h5>hi guys my name is sonic
              </div>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              width: '95%',
              bottom: '10px'
            }}
          >
            <input
              className="form-control"
              placeholder="Type a message..."
            />
          </div>
        </div>
      </div>
    )
  }
}
