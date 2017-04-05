/**
 * Format a dataset to provitde plotable data to highstocks
 * @param dataset
 * @param yAttr attribute used for the y axis
 * @param xAttr attribute used for the x axis. This has to be a date/datetime value. Default : date
 * @returns array of double tuples e.g. [[x1, y1], [x2, y2]]
 */
export function formatDataSet(dataset, yAttr, xAttr = 'date') {
  return dataset.map(data => {
    let xValue;
    let date = data[xAttr].substring(0, 10).split('-');
    let time = data[xAttr].substring(11, 19).split(':');
    // Month is represented by an integer between 0 and 11. Thus, we need to adjust it.
    xValue = Date.UTC(date[0], date[1]-1, date[2], time[0], time[1], time[2]);
    return [xValue, data[yAttr]];
  });
}