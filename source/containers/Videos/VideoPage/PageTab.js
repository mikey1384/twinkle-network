import PropTypes from 'prop-types'
import React from 'react'
import FilterBar from 'components/FilterBar'

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
    <FilterBar>
      <nav className={watchTabActive ? 'active' : ''} onClick={onWatchTabClick}>
        <a>Video</a>
      </nav>
      <nav
        className={watchTabActive ? '' : 'active'}
        onClick={onQuestionTabClick}
      >
        <a>Questions {questions.length > 0 && `(${questions.length})`}</a>
      </nav>
    </FilterBar>
  )
}
