// CloudscapeLineChart.tsx

import React, { useRef } from 'react';
import {
  LineChart,
  MixedLineBarChartProps,
} from '@cloudscape-design/components';
import { displayAsMoney } from '@bpenwell/rei-module';

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
  interactive?: boolean;
  compressData?: boolean;
  addCommas?: boolean;
  decimalCount?: number;
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

  const chartRef = useRef<HTMLDivElement>(null);

  const xDomain = labels.map((label) => Number(label));

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

  /*const handleChartClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onPointClick || !chartRef.current) return;
  
    // Replace '.awsui-line-chart__plot-container' with the actual class name of the plotting area
    const plotRect = chartRef.current.getBoundingClientRect();
    const clickX = event.clientX - plotRect.left;
    const clickY = event.clientY - plotRect.top;
  
    const plotWidth = plotRect.width;
    const plotHeight = plotRect.height;
  
    const xScale = (xDomain[xDomain.length - 1] - xDomain[0]) / plotWidth;
    const yValues = series.flatMap((s) => s.data.map((d) => d.y));
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const yScale = (yMax - yMin) / plotHeight;
  
    const xValue = xDomain[0] + clickX * xScale;
    const yValue = yMax - clickY * yScale;
  
    console.log('clickX', clickX, 'clickY', clickY);
    console.log('xValue', xValue, 'yValue', yValue);
  
    let closestPoint = { index: -1, distance: Infinity, x: 0, y: 0, label: '' };
  
    series.forEach((s) => {
      s.data.forEach((point, index) => {
        const distance = Math.sqrt(
          Math.pow(point.x - xValue, 2) + Math.pow(point.y - yValue, 2)
        );
        if (distance < closestPoint.distance) {
          closestPoint = {
            index,
            distance,
            x: point.x,
            y: point.y,
            label: labels[index],
          };
        }
      });
    });
  
    console.log('closestPoint', closestPoint);
  
    if (closestPoint.index !== -1) {
      onPointClick(closestPoint.index, closestPoint.y, closestPoint.label);
    }
  };*/

  return (
    <div
      ref={chartRef}
      style={{ position: 'relative', width: '100%', height: '300px' }}
    >
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
      />
      {/*interactive && (
        <div
          onClick={handleChartClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            backgroundColor: 'transparent',
          }}
        />
      )*/}
    </div>
  );
};