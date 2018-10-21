import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Bio from 'components/Texts/Bio';
import ContactItems from './ContactItems';
import { processedStringWithURL } from 'helpers/stringHelpers';
import { profileThemes } from 'constants/defaultValues';
import { Color } from 'constants/css';

export default class BasicInfo extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      email: PropTypes.string,
      profileTheme: PropTypes.string,
      statusColor: PropTypes.string,
      statusMsg: PropTypes.string,
      youtube: PropTypes.string
    }).isRequired
  };
  render() {
    const {
      profile: {
        email,
        profileTheme,
        statusMsg,
        profileFirstRow,
        profileSecondRow,
        profileThirdRow,
        youtube
      }
    } = this.props;
    return (
      <div>
        <SectionPanel
          headerStyle={profileThemes[profileTheme]}
          title="Bio"
          loaded={true}
          loadMoreButtonShown={false}
        >
          {statusMsg && (
            <>
              <div
                style={{
                  fontSize: '2rem',
                  textAlign: 'center',
                  paddingBottom: '2rem'
                }}
                dangerouslySetInnerHTML={{
                  __html: processedStringWithURL(statusMsg)
                }}
              />
              {(profileFirstRow || profileSecondRow || profileThirdRow) && (
                <hr
                  style={{
                    padding: '1px',
                    background: '#fff',
                    borderTop: `2px solid ${Color.lightGray()}`,
                    borderBottom: `2px solid ${Color.lightGray()}`
                  }}
                />
              )}
            </>
          )}
          {(profileFirstRow || profileSecondRow || profileThirdRow) && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Bio
                style={{ fontSize: '2rem', marginBottom: '1rem' }}
                firstRow={profileFirstRow}
                secondRow={profileSecondRow}
                thirdRow={profileThirdRow}
              />
            </div>
          )}
        </SectionPanel>
        <SectionPanel
          headerStyle={profileThemes[profileTheme]}
          style={{
            fontSize: '1.7rem'
          }}
          title="Social"
          loaded={true}
          loadMoreButtonShown={false}
        >
          <ContactItems
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '50%'
            }}
            email={email}
            youtube={youtube}
          />
        </SectionPanel>
      </div>
    );
  }
}
