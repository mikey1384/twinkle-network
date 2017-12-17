import PropTypes from 'prop-types'
import React from 'react'

PageTab.propTypes = {
  onQuestionTabClick: PropTypes.func.isRequired,
  onWatchTabClick: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  watchTabActive: PropTypes.bool.isRequired
}
export default function PageTab({
  watchTabActive,
  onWatchTabClick,
  onQuestionTabClick,
  questions
}) {
  return (
    <div className="row container-fluid">
      <ul
        className="nav nav-tabs nav-justified"
        style={{ width: '100%', fontSize: '1.3em', fontWeight: 'bold' }}
      >
        <li
          className={watchTabActive ? 'active' : ''}
          style={{ cursor: 'pointer' }}
          onClick={onWatchTabClick}
        >
          <a>Video</a>
        </li>
        <li
          className={watchTabActive ? '' : 'active'}
          style={{ cursor: 'pointer' }}
          onClick={onQuestionTabClick}
        >
          <a>Questions {questions.length > 0 && `(${questions.length})`}</a>
        </li>
      </ul>
    </div>
  )
}
