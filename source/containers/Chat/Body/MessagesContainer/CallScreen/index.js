import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

CallScreen.propTypes = {
  style: PropTypes.object
};

export default function CallScreen({ style }) {
  const {
    state: { channelOnCall },
    actions: { onShowIncoming }
  } = useChatContext();
  const { userId } = useMyState();
  const isMakingCall = useMemo(() => {
    return channelOnCall.callerId && channelOnCall.callerId === userId;
  }, [channelOnCall, userId]);
  const isReceivingCall = useMemo(() => {
    return channelOnCall.callerId && channelOnCall.callerId !== userId;
  }, [channelOnCall, userId]);

  return (
    <div style={{ width: '100%', position: 'relative', ...style }}>
      {isMakingCall && !channelOnCall.incomingShown && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          Calling...
        </div>
      )}
      {isReceivingCall && !channelOnCall.incomingShown && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button filled color="green">
            <Icon icon="phone-volume" />
            <span
              style={{ marginLeft: '1rem' }}
              onClick={() => onShowIncoming()}
            >
              Answer
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
