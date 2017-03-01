import React, { PropTypes } from 'react';
import ReactHighcharts from 'react-highcharts';

const config = {
  chart: {
    type: 'column',
    backgroundColor: '#FFFFFF'
  },
  title: {
    text: 'Simulation Chart'
  },
  xAxis: {
    categories: ['Jan', 'Fev', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    title: {
      text: 'Profit'
    }
  },
  series: [{}]
};

class SimulationChart extends React.Component {
  componentDidMount() {
    //let chart = this.refs.chart.getChart();
    //chart.series[0].addPoint({x: 10, y: 12});
  }

  render() {
    console.log(this.props.days);
    config.series = this.props.days.map((day) => {
      return day.id;
    });
    return <ReactHighcharts config={config}></ReactHighcharts>;
  }
}

SimulationChart.propTypes = {
  days: PropTypes.array
};

export default SimulationChart;