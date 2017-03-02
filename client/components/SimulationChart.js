import React, { PropTypes } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';

class SimulationChart extends React.Component {
  constructor(props) {
    super(props);
    this.config = {
      chart: {
        type: 'column',
      },
      plotOptions: {
        column: {
          groupPadding: '0'
        },
        series: {
          cursor: 'pointer',
          events: {
            click: () => {
              this.props.goToDailyChart(1);
            }
          },
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
  }
  render() {
    this.config.series[0].data = this.props.days.map((day) => {
      let date = day.date.split('-');
      return [Date.UTC(date[0], date[1], date[2]), day.profit];
    });
    return <ReactHighstock config={this.config}></ReactHighstock>;
  }
}

SimulationChart.propTypes = {
  days: PropTypes.array,
  goToDailyChart: PropTypes.func
};

export default SimulationChart;