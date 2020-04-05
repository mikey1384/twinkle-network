import React from 'react';
import { borderRadius, Color, desktopMinWidth } from 'constants/css';
import { useAppContext } from 'contexts';
import { css } from 'emotion';

export default function LoginToViewContent() {
  const {
    user: {
      actions: { onOpenSigninModal }
    }
  } = useAppContext();

  return (
    <div
      onClick={onOpenSigninModal}
      className={css`
        width: 100%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1rem;
        padding: 1rem;
        font-size: 1.7rem;
        border-radius: ${borderRadius};
        border: 1px solid ${Color.black()};
      `}
    >
      <span
        className={css`
          @media (min-width: ${desktopMinWidth}) {
            &:hover {
              text-decoration: underline;
            }
          }
        `}
      >
        You must log in to view this content
      </span>
    </div>
  );
}
