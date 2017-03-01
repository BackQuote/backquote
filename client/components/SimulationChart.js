import React, { PropTypes } from 'react';
import ReactHighcharts from 'react-highcharts';

const config = {
  chart: {
    type: 'column',
    backgroundColor: '#FFFFFF'
  },
  plotOptions: {
    series: {
      stacking: 'null'
    }
  },
  title: {
    text: 'Simulation Chart'
  },
  xAxis: {
    categories: []
  },
  yAxis: {
    title: {
      text: 'Profit'
    }
  },
  series: [{
    color: '#00FF00'
  }, {
    color: '#FF0000'
  }]
};

class SimulationChart extends React.Component {
  componentDidMount() {
    //let chart = this.refs.chart.getChart();
    //chart.series[0].addPoint({x: 10, y: 12});
  }

  render() {
    this.props.days.forEach((day) => {
      config.xAxis.categories.push(day.date);
      if (day.profit < 0) {
        config.series[0].data.push(null);
        config.series[1].data.push(day.profit);
      } else {
        config.series[0].data.push(day.profit);
        config.series[1].data.push(null);
      }
    });
    return <ReactHighcharts config={config}></ReactHighcharts>;
  }
}

SimulationChart.propTypes = {
  days: PropTypes.array
};

export default SimulationChart;