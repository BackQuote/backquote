import React, { PropTypes } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';
import { formatDataSet } from '../utilities/charts';

class SimulationChart extends React.Component {
  constructor(props) {
    super(props);
    this.config = {
      chart: {
        type: 'column',
        height: 400
      },
      plotOptions: {
        column: {
          groupPadding: '0'
        },
        series: {
          cursor: 'pointer',
          events: {
            click: () => {
              this.refs.chart.chart.xAxis[0].setExtremes(0, 1);
              let point = event.point;
              let result = this.props.results[point.index];
              this.config.xAxis.plotLines = [{
                color: '#48B4E7',
                width: 1,
                value: point.x
              }];
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
    this.config.series[0].data = formatDataSet(this.props.results, this.props.profitType);
    return (
      <ReactHighstock ref="chart" config={this.config}> </ReactHighstock>
    );
  }
}

SimulationChart.propTypes = {
  results: PropTypes.array,
  updateDailyResultChart: PropTypes.func,
  profitType: PropTypes.string
};

export default SimulationChart;