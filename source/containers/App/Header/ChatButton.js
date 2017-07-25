import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'

ChatButton.propTypes = {
  chatMode: PropTypes.bool,
  loading: PropTypes.bool,
  numUnreads: PropTypes.number,
  onClick: PropTypes.func.isRequired
}
export default function ChatButton({onClick, chatMode, loading, numUnreads = 0}) {
  return (
    <li>
      <a
        style={{
          paddingTop: '6px',
          paddingBottom: '0px'
        }}
      >
        <Button
          className={`btn ${chatMode ? 'btn-warning' : 'btn-default'}`}
          onClick={onClick}
          disabled={loading}
        >
          {!loading && !chatMode && <span><span className="glyphicon glyphicon-comment"></span>&nbsp;</span>}
          {loading && <span><span className="glyphicon glyphicon-refresh spinning"></span>&nbsp;</span>}
          {`${chatMode ? 'Close' : ' Talk'} `}
          {!chatMode && numUnreads > 0 &&
            <span
              className="badge"
              style={{backgroundColor: 'red'}}
            >
              {numUnreads}
            </span>
          }
        </Button>
      </a>
    </li>
  )
}
