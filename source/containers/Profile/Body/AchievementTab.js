import React from 'react';
import SectionPanel from 'components/SectionPanel';
import ErrorBoundary from 'components/ErrorBoundary';
import PropTypes from 'prop-types';
import Achievement from 'components/Achievement';
import { css } from 'emotion';

AchievementTab.propTypes = {
  profile: PropTypes.object.isRequired,
  xp: PropTypes.number,
  selectedTheme: PropTypes.string,
  joinDate: PropTypes.string,
  userType: PropTypes.string
};

export default function AchievementTab({
  profile,
  xp = 0,
  selectedTheme,
  joinDate,
  userType
}) {
  const { username } = profile;
  return (
    <ErrorBoundary>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          width: 90%;
        `}
      >
        {xp >= 100 && (
          <SectionPanel
            customColorTheme={selectedTheme}
            title={username + "'s XP Achievements"}
            loaded
          >
            <Achievement
              title="Baby's Step"
              earnText="Reach 100 XP"
              icon="book"
              iconColor="brown"
              hadEarned={xp >= 100}
            />
            <Achievement
              title="Reach of the Lands of Knowledge"
              earnText="Reach 1,000 XP"
              icon="ship"
              iconColor="white"
              backgroundColor="aqua"
              hadEarned={xp >= 1000}
            />
            <Achievement
              title="The Rise of Wisdom"
              earnText="Reach 5,000 XP"
              icon="brain"
              iconColor="white"
              backgroundColor="brown"
              hadEarned={xp >= 5000}
            />
            <Achievement
              title="Reach of The World of Logic"
              earnText="Reach 25,000 XP"
              icon={['fas', 'toggle-on']}
              iconColor="logoBlue"
              backgroundColor="lime"
              hadEarned={xp >= 25000}
            />
            <Achievement
              title="Learning Addiction"
              earnText="Reach 100,000 XP"
              icon={['fas', 'wine-bottle']}
              iconColor="darkCyan"
              backgroundColor="orange"
              hadEarned={xp >= 100000}
            />
            <Achievement
              title="Reach of the Land of Imagination"
              earnText="Reach 500,000 XP"
              icon={['fas', 'head-side-brain']}
              iconColor="brown"
              backgroundColor="red"
              hadEarned={xp >= 500000}
            />
            <Achievement
              title="Learning Virus"
              earnText="Reach 1,000,000 XP"
              icon={['fas', 'disease']}
              iconColor="darkBlue"
              backgroundColor="lawngreen"
              hadEarned={xp >= 1000000}
            />
            <Achievement
              title="Learning Infection"
              earnText="Reach 5,000,000 XP"
              icon={['fas', 'biohazard']}
              iconColor="orange"
              backgroundColor="green"
              hadEarned={xp >= 5000000}
            />
          </SectionPanel>
        )}
        <SectionPanel
          customColorTheme={selectedTheme}
          title={username + "'s Twinkle Achievements"}
          loaded
        >
          <Achievement
            title="Twinkle User"
            earnText="Make an account to Twinkle"
            icon="user"
            iconColor="white"
            hadEarned
          />
          <Achievement
            title="New Twinkle User"
            earnText={'Be 1 week old (Twinkle User Age)'}
            icon="user"
            iconColor="green"
            backgroundColor="aqua"
            hadEarned={getProfileDayAge(joinDate) >= 7}
          />
          <Achievement
            title="Bronze Twinkle User"
            earnText={'Be 1 month old (Twinkle User Age)'}
            icon="medal"
            iconColor="brown"
            backgroundColor="gray"
            hadEarned={getProfileDayAge(joinDate) >= 31}
          />
          <Achievement
            title="Silver Twinkle User"
            earnText={'Be 3 month old (Twinkle User Age)'}
            icon="medal"
            iconColor="silver"
            backgroundColor="orange"
            hadEarned={getProfileDayAge(joinDate) >= 93}
          />
          <Achievement
            title="Gold Twinkle User"
            earnText={'Be 6 months old (Twinkle User Age)'}
            icon="medal"
            iconColor="gold"
            backgroundColor="green"
            hadEarned={getProfileDayAge(joinDate) >= 186}
          />
          <Achievement
            title="Veteran"
            earnText={'Be 1 year old (Twinkle User Age)'}
            icon="user-tie"
            iconColor="black"
            backgroundColor="crimson"
            hadEarned={getProfileDayAge(joinDate) >= 366}
          />
          <Achievement
            title="Platinum Twinkle User"
            earnText={'Be 1 year and 6 months old (Twinkle User Age)'}
            icon="medal"
            iconColor="platinum"
            backgroundColor="lawngreen"
            hadEarned={getProfileDayAge(joinDate) >= 551}
          />
          <Achievement
            title="Diamond Twinkle User"
            earnText={'Be 3 years old (Twinkle User Age)'}
            icon="medal"
            iconColor="diamond"
            backgroundColor="coral"
            hadEarned={getProfileDayAge(joinDate) >= 1095}
          />
          <Achievement
            title="Twinkle Wizard"
            earnText={'Be 5 years old (Twinkle User Age)'}
            icon="hat-wizard"
            iconColor="darkBlue"
            backgroundColor="purple"
            hadEarned={getProfileDayAge(joinDate) >= 1825}
          />
          <Achievement
            title="Twinkle Student"
            earnText={'Be a Twinkle Student'}
            icon="users-class"
            iconColor="purple"
            backgroundColor="lavender"
            hadEarned={
              userType
                ? !(
                    userType.includes('teacher') ||
                    userType.includes('admin') ||
                    userType.includes('creator')
                  )
                : true
            }
          />
          <Achievement
            title="Twinkle Teacher"
            earnText={'Be a Twinkle Teacher'}
            icon="chalkboard-teacher"
            iconColor="purple"
            backgroundColor="lavender"
            hadEarned={
              userType
                ? userType.includes('teacher') ||
                  userType.includes('admin') ||
                  userType.includes('creator')
                : false
            }
          />
        </SectionPanel>
      </div>
    </ErrorBoundary>
  );
}

function getProfileDayAge(joinDate) {
  const seconds = Math.floor((new Date() - Number(joinDate) * 1000) / 1000);
  return Math.floor(seconds / 86400);
}
