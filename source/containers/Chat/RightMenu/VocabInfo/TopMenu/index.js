import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Color } from 'constants/css';
import { useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import Collector from './Collector';
import FilterBar from 'components/FilterBar';

export default function TopMenu() {
  const { numWordsCollected } = useMyState();
  const {
    state: {
      wordCollectors: { all, top30s }
    }
  } = useChatContext();
  const [allSelected, setAllSelected] = useState(numWordsCollected > 0);
  const wordCollectors = useMemo(() => (allSelected ? all : top30s), [
    all,
    allSelected,
    top30s
  ]);
  const prevNumWordsCollectedRef = useRef(0);

  useEffect(() => {
    if (prevNumWordsCollectedRef.current === 0 && numWordsCollected > 0) {
      setAllSelected(true);
    }
    prevNumWordsCollectedRef.current = numWordsCollected;
  }, [numWordsCollected]);

  return (
    <div
      style={{
        height: '50%',
        borderBottom: `1px solid ${Color.borderGray()}`,
        overflow: 'scroll'
      }}
    >
      <div
        style={{
          fontSize: '1.7rem',
          padding: '1rem',
          textAlign: 'center',
          fontWeight: 'bold',
          background: Color.brownOrange(),
          color: '#fff'
        }}
      >
        Collectors of High Level Words
      </div>
      {numWordsCollected > 0 && (
        <FilterBar style={{ fontSize: '1.5rem', height: '4rem' }}>
          <nav
            onClick={() => setAllSelected(true)}
            className={allSelected ? 'active' : ''}
          >
            Rankings
          </nav>
          <nav
            onClick={() => setAllSelected(false)}
            className={!allSelected ? 'active' : ''}
          >
            Top 30s
          </nav>
        </FilterBar>
      )}
      <div style={{ marginTop: '1rem' }}>
        {wordCollectors
          .filter(collector => collector.numWordsCollected > 0)
          .map(collector => (
            <Collector
              key={collector.username}
              style={{ padding: '1rem' }}
              user={collector}
            />
          ))}
      </div>
    </div>
  );
}
