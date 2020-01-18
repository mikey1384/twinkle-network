import React, { useEffect } from 'react';
import { Color } from 'constants/css';
import { useAppContext, useChatContext } from 'contexts';
import Collector from './Collector';

export default function TopMenu() {
  const {
    requestHelpers: { loadWordCollectors }
  } = useAppContext();
  const {
    state: { wordCollectors },
    actions: { onLoadWordCollectors }
  } = useChatContext();

  useEffect(() => {
    init();

    async function init() {
      const data = await loadWordCollectors();
      onLoadWordCollectors(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div style={{ marginTop: '1rem' }}>
        {wordCollectors
          .filter(collector => collector.numWordsCollected > 0)
          .map(collector => (
            <Collector
              key={collector.id}
              style={{ padding: '1rem' }}
              user={collector}
            />
          ))}
      </div>
    </div>
  );
}
