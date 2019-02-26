import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import BarChart from './BarChart';
import { loadMonthlyXp } from 'helpers/requestHelpers';

export default class MonthlyXp extends Component {
  static propTypes = {
    selectedTheme: PropTypes.string,
    userId: PropTypes.number.isRequired
  };

  mounted = false;

  state = {
    data: undefined,
    loaded: false
  };

  async componentDidMount() {
    const { userId } = this.props;
    this.mounted = true;
    const data = await loadMonthlyXp(userId);
    if (this.mounted) {
      this.setState({ data, loaded: true });
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      const data = await loadMonthlyXp(this.props.userId);
      if (this.mounted) {
        this.setState({ data, loaded: true });
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { selectedTheme } = this.props;
    const { data, loaded } = this.state;
    return (
      <SectionPanel
        customColorTheme={selectedTheme}
        title="Monthly XP Growth"
        loaded={loaded}
      >
        {data && (
          <BarChart bars={data?.bars || []} topValue={data?.topValue || 1} />
        )}
      </SectionPanel>
    );
  }
}
