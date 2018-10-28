import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import BarChart from './BarChart';
import { loadMonthlyXp } from 'helpers/requestHelpers';

export default class MonthlyXp extends Component {
  static propTypes = {
    headerTheme: PropTypes.object.isRequired,
    userId: PropTypes.number.isRequired
  };

  state = {
    data: undefined,
    loaded: false
  };

  async componentDidMount() {
    const { userId } = this.props;
    const data = await loadMonthlyXp(userId);
    this.setState({ data, loaded: true });
  }

  render() {
    const { headerTheme } = this.props;
    const { data, loaded } = this.state;
    return (
      <SectionPanel
        headerTheme={headerTheme}
        title="Monthly XP Growth"
        loaded={loaded}
      >
        {data && <BarChart data={data} />}
      </SectionPanel>
    );
  }
}
