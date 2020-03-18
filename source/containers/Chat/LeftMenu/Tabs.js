import React from 'react';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { Color, phoneMaxWidth } from 'constants/css';
import { useChatContext } from 'contexts';

export default function Tabs() {
  const {
    state: { selectedChatTab },
    actions: { onSelectChatTab }
  } = useChatContext();

  return (
    <div
      style={{ width: '20%' }}
      className={css`
        padding: 0 1rem 1rem 1rem;
        > nav {
          cursor: pointer;
          width: 100%;
          height: 7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          > svg {
            font-size: 3rem;
          }
          @media (max-width: ${phoneMaxWidth}) {
            height: 5rem;
            > svg {
              font-size: 1.7rem;
            }
          }
        }
      `}
    >
      <nav
        style={{
          color: selectedChatTab === 'home' ? Color.black() : Color.gray()
        }}
        onClick={() => onSelectChatTab('home')}
      >
        <Icon icon="home" />
      </nav>
      {false && (
        <nav
          style={{
            color: selectedChatTab === 'group' ? Color.black() : Color.gray()
          }}
          onClick={() => onSelectChatTab('group')}
        >
          <Icon icon="star" />
        </nav>
      )}
      <nav
        style={{
          color: selectedChatTab === 'class' ? Color.black() : Color.gray()
        }}
        onClick={() => onSelectChatTab('class')}
      >
        <Icon icon="chalkboard-teacher" />
      </nav>
    </div>
  );
}
