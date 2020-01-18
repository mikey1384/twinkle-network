import React from 'react';
import SectionPanel from 'components/SectionPanel';
import ErrorBoundary from 'components/ErrorBoundary';
import PropTypes from 'prop-types';
import Achievement from 'components/Achievement';

XPAchievements.propTypes = {
  selectedTheme: PropTypes.string,
  xp: PropTypes.number
};

export default function XPAchievements({ selectedTheme, xp }) {
  return (
    <ErrorBoundary>
      {xp >= 100 && (
        <SectionPanel
          customColorTheme={selectedTheme}
          title="XP Achievements"
          loaded
        >
          {xp >= 100 && (
            <Achievement
              title="Baby's Step"
              earnText="Reach 100 XP"
              icon="book"
              iconColor="brown"
            />
          )}
          {xp >= 1000 && (
            <Achievement
              title="Reach of the Lands of Knowledge"
              earnText="Reach 1,000 XP"
              icon="ship"
              iconColor="white"
              backgroundColor="aqua"
            />
          )}
          {xp >= 5000 && (
            <Achievement
              title="The Rise of Wisdom"
              earnText="Reach 5,000 XP"
              icon="brain"
              iconColor="white"
              backgroundColor="brown"
            />
          )}
          {xp >= 25000 && (
            <Achievement
              title="Reach of The World of Logic"
              earnText="Reach 25,000 XP"
              icon={['fas', 'toggle-on']}
              iconColor="logoBlue"
              backgroundColor="lime"
            />
          )}
          {xp >= 100000 && (
            <Achievement
              title="Learning Addiction"
              earnText="Reach 100,000 XP"
              icon={['fas', 'wine-bottle']}
              iconColor="darkCyan"
              backgroundColor="orange"
            />
          )}
          {xp >= 500000 && (
            <Achievement
              title="Reach of the Land of Imagination"
              earnText="Reach 500,000 XP"
              icon={['fas', 'head-side-brain']}
              iconColor="brown"
              backgroundColor="red"
            />
          )}
          {xp >= 1000000 && (
            <Achievement
              title="Learning Virus"
              earnText="Reach 1,000,000 XP"
              icon={['fas', 'disease']}
              iconColor="darkBlue"
              backgroundColor="green"
            />
          )}
        </SectionPanel>
      )}
    </ErrorBoundary>
  );
}
