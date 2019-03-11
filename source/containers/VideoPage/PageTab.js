import PropTypes from 'prop-types';
import React from 'react';
import FilterBar from 'components/FilterBar';
import { connect } from 'react-redux';

PageTab.propTypes = {
  onQuestionTabClick: PropTypes.func.isRequired,
  onWatchTabClick: PropTypes.func.isRequired,
  profileTheme: PropTypes.string,
  questions: PropTypes.array.isRequired,
  watchTabActive: PropTypes.bool.isRequired
};

function PageTab({
  watchTabActive,
  onWatchTabClick,
  onQuestionTabClick,
  profileTheme,
  questions
}) {
  const themeColor = profileTheme || 'logoBlue';
  return (
    <FilterBar color={themeColor}>
      <nav className={watchTabActive ? 'active' : ''} onClick={onWatchTabClick}>
        Video
      </nav>
      <nav
        className={watchTabActive ? '' : 'active'}
        onClick={onQuestionTabClick}
      >
        Questions {questions.length > 0 && `(${questions.length})`}
      </nav>
    </FilterBar>
  );
}

export default connect(state => ({
  profileTheme: state.UserReducer.profileTheme
}))(PageTab);
