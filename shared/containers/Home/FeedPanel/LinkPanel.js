import React from 'react';
import {embedlyKey} from 'constants/keys';
import Embedly from 'react-embedly';

export default function LinkPanel() {
  return (
    <div className="panel panel-default"
      style={{
        borderTop: '1px solid rgb(231, 231, 231)'
      }}
    >
      <div className="panel-heading">
        <span className="dropdown">
          <strong>mikey</strong> shared a link
        </span>
      </div>
      <div className="panel-body">
        <Embedly url="http://mashable.com/2016/10/09/pregnancy-annoucement-dad-cute-reaction/?utm_cid=mash-com-fb-socmed-link#etD.iIb1wRqV" apiKey={embedlyKey} />
      </div>
    </div>
  )
}
