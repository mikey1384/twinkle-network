import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import BarChart from './BarChart';
import ErrorBoundary from 'components/ErrorBoundary';
import { useAppContext } from 'contexts';

MonthlyXp.propTypes = {
  selectedTheme: PropTypes.string,
  userId: PropTypes.number.isRequired
};

export default function MonthlyXp({ selectedTheme, userId }) {
  const {
    requestHelpers: { loadMonthlyXp }
  } = useAppContext();
  const [data, setData] = useState();
  const [loaded, setLoaded] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    init();
    async function init() {
      const data = await loadMonthlyXp(userId);
      if (mounted.current) {
        setData(data);
        setLoaded(true);
      }
    }
    return function cleanUp() {
      mounted.current = false;
    };
  }, [userId]);

  return (
    <ErrorBoundary>
      <SectionPanel
        customColorTheme={selectedTheme}
        title="Monthly XP Growth"
        loaded={loaded}
      >
        {data && (
          <BarChart bars={data?.bars || []} topValue={data?.topValue || 1} />
        )}
      </SectionPanel>
    </ErrorBoundary>
  );
}
