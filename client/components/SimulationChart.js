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
              let result = this.props.results[event.point.index];
              this.props.updateDailyResultChart(result.id, result.dayId);
            }
          },
          zones: [{
            value: 0,
            color: '#f93943'
          }, {
            color: '#6cd899'
          }],
          dataGrouping: {
            enabled: false
          }
        }
      },
      rangeSelector: {
        selected: 1
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
    this.config.series[0].data = this.props.results.map((result) => {
      let date = result.date.split('-');
      date = [Date.UTC(date[0], date[1], date[2])];
      return [date, result[this.props.profitType]];
    });
    return (
      <ReactHighstock config={this.config}> </ReactHighstock>
    );
  }
}

SimulationChart.propTypes = {
  results: PropTypes.array,
  updateDailyResultChart: PropTypes.func,
  profitType: PropTypes.string
};

export default SimulationChart;