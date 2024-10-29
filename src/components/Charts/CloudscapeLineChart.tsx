// CloudscapeLineChart.tsx

import React from 'react';
import {
  LineChart,
  LineChartProps,
  MixedLineBarChartProps,
} from '@cloudscape-design/components';
import { displayAsMoney } from '@bpenwell/rei-module';
import { EmojiFoodBeverageTwoTone } from '@mui/icons-material';

export interface ILineChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

export interface ILineChartProps {
  datasets: ILineChartDataset[];
  labels: string[];
  title?: string;
  onPointClick?: (index: number, value: number, label: string) => void;
  interactive?: boolean; // Defaults to true
  compressData?: boolean; // Defaults to true
  addCommas?: boolean; // Defaults to false
  decimalCount?: number; // Defaults to 0
}

export const CloudscapeLineChart: React.FC<ILineChartProps> = (props) => {
  const {
    datasets,
    labels,
    title,
    onPointClick,
    interactive = true,
    compressData = true,
    addCommas = false,
    decimalCount = 0,
  } = props;

  // Create xDomain from labels (assuming labels are numeric strings)
  const xDomain = labels.map((label) => Number(label));

  // Map datasets to Cloudscape series format
  const series: MixedLineBarChartProps.LineDataSeries<number>[] = datasets.map((dataset) => {
    const data: MixedLineBarChartProps.Datum<number>[] = dataset.data.map(
      (yValue, index) => ({
        x: xDomain[index],
        y: yValue,
      })
    );

    return {
      title: dataset.label,
      type: 'line',
      data,
      color: dataset.borderColor,
      valueFormatter: (value: number) =>
        displayAsMoney(value, decimalCount, '$', compressData, addCommas),
    };
  });

  // i18nStrings for axis formatting
  const i18nStrings: MixedLineBarChartProps.I18nStrings<number> = {
    filterLabel: 'Filter displayed data',
    filterPlaceholder: 'Filter data',
    filterSelectedAriaLabel: 'selected',
    detailPopoverDismissAriaLabel: 'Dismiss',
    legendAriaLabel: 'Legend',
    chartAriaRoleDescription: 'line chart',
    xTickFormatter: (xTick: number) => xTick.toString(),
    yTickFormatter: (yTick: number) =>
      displayAsMoney(yTick, decimalCount, '$', compressData, addCommas),
  };

  return (
    <LineChart
      series={series}
      xDomain={[xDomain[0], xDomain[xDomain.length - 1]]}
      yDomain={undefined}
      i18nStrings={i18nStrings}
      ariaLabel={title || 'Line Chart'}
      height={300}
      xScaleType="linear"
      yTitle="Cash Flow"
      xTitle="Year"
      legendTitle="Legend"
      hideFilter={true}
      /*detailPopoverSeriesContent={({ series, x, y, }) => ({
        key: (series.title),
        value: displayAsMoney(y)
      })}*/
    />
  );
};