import React, { PropTypes } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';

let config = {};
config.yAxis = [{
  title: {
    text: 'Quotes/Trades'
  },
  height: '70%'
}, {
  title: {
    text: 'Profit'
  },
  top: '75%',
  height: '25%',
  offset: 0,
  plotLines: [{
    value: 0,
    color: '#eeeeee',
    dashStyle: 'solid',
    width: 1
  }]
}];

config.tooltip = {
  split: false
};

config.series = [{
  name: 'Quote',
  data: [],
  dataGrouping: {
    enabled: false
  }
}, {
  name: 'Trade',
  data: [],
  lineWidth: 0,
  marker: {
    enabled: true,
    radius: 5
  },
  states: {
    hover: {
      lineWidthPlus: 0
    }
  }
}, {
  type: 'column',
  name: 'Profit',
  data: [],
  yAxis: 1,
  zones: [{
    value: 0,
    color: '#f93943'
  }, {
    color: '#6cd899'
  }]
}];

config.title = {
  text: 'Daily result chart'
};

class DailyResultChart extends React.Component {

  updateDataSet() {
    let { quotes, trades } = this.props;

    // TODO: fix date
    config.series[0].data = quotes.map((result, notADate) => {
      return [notADate, result.open];
    });

    // TODO: fix date
    config.series[1].data = trades.map((result, notADate) => {
      // TODO: fix trade value
      return [notADate, quotes[0].open];
    });
  }

  render() {
    this.updateDataSet();

    return (
      <ReactHighstock config={config} ref="chart"> </ReactHighstock>
    );
  }
}

DailyResultChart.propTypes = {
  quotes: React.PropTypes.array,
  trades: React.PropTypes.array,
  profit: React.PropTypes.array
};

export default DailyResultChart;
