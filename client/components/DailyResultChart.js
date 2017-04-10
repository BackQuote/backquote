import React, { PropTypes } from 'react';
import ReactHighstock from 'react-highcharts/ReactHighstock';
import { formatDataSet } from '../utilities/charts';
import * as styles from '../styles/dailyResult.scss';

let config = {};
config.chart = {
  height: 400
};
config.yAxis = [{
  offset: 30,
  title: {
    text: 'Quotes/Trades'
  }
}];

config.tooltip = {
  split: false
};

config.series = [{
  name: 'Price',
  data: [],
  dataGrouping: {
    enabled: false
  }
}, {
  name: 'Bought at',
  data: [],
  lineWidth: 0,
  marker: {
    enabled: true,
    fillColor: '#00c833',
    lineColor: '#1d1d1d',
    lineWidth: 1,
    symbol: 'triangle',
    radius: 5
  },
  states: {
    hover: {
      lineWidthPlus: 0
    }
  }
}, {
  name: 'Sold at',
  data: [],
  lineWidth: 0,
  marker: {
    enabled: true,
    fillColor: '#f93943',
    lineColor: '#1d1d1d',
    lineWidth: 1,
    symbol: 'triangle-down',
    radius: 5
  },
  states: {
    hover: {
      lineWidthPlus: 0
    }
  }
}];

class DailyResultChart extends React.Component {
  render() {
    let { quotes, trades } = this.props;
    let sells = [];
    let buys = trades.filter(trade => {
      if (trade.action === 'sell') {
        sells.push(trade);
        return false;
      }
      return true;
    });

    config.series[0].data = formatDataSet(quotes, 'open', 'timestamp');
    config.series[1].data = formatDataSet(buys, 'price', 'timestamp');
    config.series[2].data = formatDataSet(sells, 'price', 'timestamp');

    return (
      <div className={styles.container}>
        <ReactHighstock config={config} ref="chart"> </ReactHighstock>
        <a className={styles.prev} href="javascript:void(0)"
           onClick={() => {this.props.previousDailyResult();}}>
          <i className="fa fa-chevron-left fa-2x"> </i>
        </a>
        <a className={styles.next} href="javascript:void(0)"
           onClick={() => {this.props.nextDailyResult();}}>
          <i className="fa fa-chevron-right fa-2x"> </i>
        </a>
      </div>
    );
  }
}

DailyResultChart.propTypes = {
  quotes: React.PropTypes.array,
  trades: React.PropTypes.array
};

export default DailyResultChart;
