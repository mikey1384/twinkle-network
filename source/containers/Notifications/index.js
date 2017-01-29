import React, {Component} from 'react'

export default class Notifications extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div
          style={{paddingBottom: '1em', marginTop: '15px'}}
        >
          <h4>All Notifications</h4>
        </div>
        <div
          className="list-group"
          style={{
            cursor: 'pointer',
            display: 'block'
          }}
        >
          <a className="list-group-item" style={{padding: '0px'}}>
            <div style={{margin: '0 10px 0 10px'}}>
              <div style={{margin: '0 10px 0 10px', padding: '5px 0 5px 0'}}>
                <span style={{fontSize: '0.8em', whiteSpace: 'normal'}}>
                  Andy reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."
                </span>
                <p style={{fontSize: '0.9em', padding: '0px', marginTop: '5px', marginBottom: '0px'}}>1 hour ago</p>
              </div>
            </div>
          </a>
          <a className="list-group-item" style={{padding: '0px'}}>
            <div style={{margin: '0 10px 0 10px'}}>
              <div style={{margin: '0 10px 0 10px', padding: '5px 0 5px 0'}}>
                <span style={{fontSize: '0.8em', whiteSpace: 'normal'}}>
                  Andy reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."
                </span>
                <p style={{fontSize: '0.9em', padding: '0px', marginTop: '5px', marginBottom: '0px'}}>1 hour ago</p>
              </div>
            </div>
          </a>
          <a className="list-group-item" style={{padding: '0px'}}>
            <div style={{margin: '0 10px 0 10px'}}>
              <div style={{margin: '0 10px 0 10px', padding: '5px 0 5px 0'}}>
                <span style={{fontSize: '0.8em', whiteSpace: 'normal'}}>
                  Andy reacted to a post you are tagged in: "지난 주 일요일 성황리에 행사를 마무리 지었습니다. 함께 해주신 모든..."
                </span>
                <p style={{fontSize: '0.9em', padding: '0px', marginTop: '5px', marginBottom: '0px'}}>1 hour ago</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    )
  }
}
