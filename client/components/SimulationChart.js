import React, { PropTypes } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';

const config = {
  chart: {
    type: 'column',
  },
  plotOptions: {
    column: {
      groupPadding: '0'
    },
    series: {
      zones: [{
        value: 0,
        color: '#FF0000'
      }, {
        color: '#00FF00'
      }]
    }
  },
  rangeSelector: {
    selected: 1
  },
  title: {
    text: 'Simulation Chart'
  },
  xAxis: {
    type: 'datetime',
  },
  yAxis: {
    offset: 30,
    title: {
      text: 'Profit'
    }
  },
  series: [{}]
};

class SimulationChart extends React.Component {
  render() {
    config.series[0].data = this.props.days.map((day) => {
      let date = day.date.split('-');
      return [Date.UTC(date[0], date[1], date[2]), day.profit];
    });
    return <ReactHighstock config={config}></ReactHighstock>;
  }
}

SimulationChart.propTypes = {
  days: PropTypes.array
};

export default SimulationChart;