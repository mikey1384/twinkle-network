import React from 'react';
import { css } from 'emotion';
import { Color } from 'constants/css';

export default function AboutClass() {
  return (
    <div style={{ widht: '100%', padding: '1rem' }}>
      <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>Class Groups</div>
      <div
        className={css`
          margin-top: 2rem;
          font-size: 1.7rem;
          > p {
            margin-top: 1rem;
          }
        `}
      >
        <p>
          <b>Class groups</b> are special chat groups where teachers can
          organize <b style={{ color: Color.orange() }}>video chat enabled</b>
          online classes with their students.
        </p>
        <p>
          At the end of each online class session, student participants earn XP
          based on on how well they participated during class. Students who have
          demonstrated outstanding class participation may earn up to 50,000 XP,
          while those who participated poorly may not earn any XP at all.
        </p>
        <p>
          Class group feature is still being tested by teachers and moderators
          right now. It will be available to everyone in a few weeks
        </p>
      </div>
    </div>
  );
}
