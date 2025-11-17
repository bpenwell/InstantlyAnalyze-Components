// CloudscapeLineChart.tsx

import React, { useRef, useState, useEffect } from 'react';
import {
  LineChart,
  MixedLineBarChartProps,
  Popover,
  Box,
} from '@cloudscape-design/components';
import { displayAsMoney } from '@bpenwell/instantlyanalyze-module';

export interface ILineChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

export interface ITimelineMarker {
  x: number; // Year or month value on x-axis
  label: string; // Event label (e.g., "Refinance", "Sale")
  color?: string; // Color of the marker line
}

export interface ILineChartProps {
  datasets: ILineChartDataset[];
  labels: string[];
  xValues?: number[]; // Optional x-axis values (if not provided, labels will be converted to numbers)
  title?: string;
  onPointClick?: (index: number, value: number, label: string) => void;
  interactive?: boolean;
  compressData?: boolean;
  addCommas?: boolean;
  decimalCount?: number;
  timelineMarkers?: ITimelineMarker[]; // Optional timeline event markers
  useLabelBasedPositioning?: boolean; // Enable label-based marker positioning
  height?: number; // Optional height in pixels (default: 300)
  yTitle?: string; // Optional y-axis title (default: "Cash Flow")
}

// Timeline Marker Component with Popover tooltip
interface TimelineMarkerProps {
  marker: ITimelineMarker;
  leftPosition: number;
  markerColor: string;
  index: number;
  verticalOffset?: number; // Vertical stacking offset for collision avoidance
}

const TimelineMarker: React.FC<TimelineMarkerProps> = ({
  marker,
  leftPosition,
  markerColor,
  index,
  verticalOffset = 0
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Format the label for display (remove newlines, capitalize)
  const displayLabel = marker.label.replace(/\n/g, ' ').trim();

  // Get event type for aria label
  const ariaLabel = `Timeline event: ${displayLabel} at month ${marker.x}`;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${leftPosition}%`,
        top: '0',
        height: '100%',
        width: '0',
        zIndex: 20,
      }}
      role="img"
      aria-label={ariaLabel}
    >
      {/* Vertical line indicator */}
      <div
        style={{
          position: 'absolute',
          left: '-1px',
          top: '0',
          height: 'calc(100% + 50px)',
          width: '2px',
          borderLeft: '2px dotted #6b7280',
          pointerEvents: 'none',
        }}
      />

      {/* Badge label with popover */}
      <Popover
        dismissButton={false}
        position="top"
        size="small"
        triggerType="custom"
        content={
          <Box variant="small">
            <strong>{displayLabel}</strong>
            <br />
            Month {marker.x}
          </Box>
        }
      >
        <div
          style={{
            position: 'absolute',
            top: `${10 + verticalOffset}px`,
            left: '4px',
            backgroundColor: markerColor,
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            pointerEvents: 'auto',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            zIndex: 21 + index, // Ensure proper stacking order
          }}
          onMouseEnter={() => setIsPopoverOpen(true)}
          onMouseLeave={() => setIsPopoverOpen(false)}
          tabIndex={0}
          role="button"
          aria-label={ariaLabel}
        >
          {displayLabel}
        </div>
      </Popover>
    </div>
  );
};

export const CloudscapeLineChart: React.FC<ILineChartProps> = (props) => {
  const {
    datasets,
    labels,
    xValues,
    title,
    onPointClick,
    interactive = true,
    compressData = true,
    addCommas = false,
    decimalCount = 0,
    timelineMarkers = [],
    useLabelBasedPositioning = false,
    height = 300,
    yTitle = "Cash Flow",
  } = props;

  const chartRef = useRef<HTMLDivElement>(null);
  const [labelPositions, setLabelPositions] = useState<Map<string, number>>(new Map());

  // Use provided xValues if available, otherwise convert labels to numbers
  const xDomain = xValues || labels.map((label) => Number(label));

  console.log('[CloudscapeLineChart] xValues provided:', !!xValues);
  console.log('[CloudscapeLineChart] xDomain first 5:', xDomain.slice(0, 5));
  console.log('[CloudscapeLineChart] xDomain last 5:', xDomain.slice(-5));
  console.log('[CloudscapeLineChart] xDomain contains NaN:', xDomain.some(x => isNaN(x)));

  // Extract label positions when chart renders (for label-based positioning)
  useEffect(() => {
    if (!useLabelBasedPositioning || !chartRef.current) return;

    const extractLabelPositions = () => {
      const chartElement = chartRef.current;
      if (!chartElement) return;

      // Find x-axis label elements
      const labelElements = chartElement.querySelectorAll('.awsui_labels-block-end_f0fot_1tlqz_81 text');
      const positions = new Map<string, number>();

      labelElements.forEach((labelElement) => {
        const textContent = labelElement.textContent?.trim();
        if (textContent) {
          const rect = labelElement.getBoundingClientRect();
          const chartRect = chartElement.getBoundingClientRect();
          const relativePosition = ((rect.left + rect.width / 2) - chartRect.left) / chartRect.width;
          positions.set(textContent, relativePosition * 100);
        }
      });

      console.log('[CloudscapeLineChart] Extracted label positions:', Array.from(positions.entries()));
      setLabelPositions(positions);
    };

    // Extract positions after a short delay to ensure chart is fully rendered
    const timeoutId = setTimeout(extractLabelPositions, 100);

    // Also listen for window resize to update positions
    const handleResize = () => setTimeout(extractLabelPositions, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [useLabelBasedPositioning, datasets, labels, xValues]);

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
    xTickFormatter: (xTick: number) => {
      // Format x-axis: if < 24 (months), show as "Mo X", otherwise show as "Yr X"
      if (xTick < 24) {
        return `Mo ${Math.floor(xTick)}`;
      } else {
        const year = Math.floor(xTick / 12);
        // Add landmark styling indicator for Year 3 (the transition point)
        return year === 3 ? `★ Yr ${year}` : `Yr ${year}`;
      }
    },
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
  
  
    if (closestPoint.index !== -1) {
      onPointClick(closestPoint.index, closestPoint.y, closestPoint.label);
    }
  };*/

  // Label-based marker positioning (interpolates between extracted label positions)
  const getLabelBasedMarkerPosition = (xValue: number): number => {
    if (labelPositions.size === 0) {
      // Fallback to pixel-based if labels not extracted yet
      return getPixelBasedMarkerPosition(xValue);
    }

    // Convert label positions to {month, position} array for interpolation
    const labelPoints: { month: number; position: number }[] = [];

    labelPositions.forEach((position, label) => {
      let month: number;

      if (label.startsWith('Mo ')) {
        month = parseInt(label.substring(3));
      } else if (label.startsWith('★ Yr ') || label.startsWith('Yr ')) {
        const yearStr = label.startsWith('★ Yr ') ? label.substring(5) : label.substring(3);
        month = parseInt(yearStr) * 12;
      } else {
        return; // Skip unrecognized labels
      }

      labelPoints.push({ month, position });
    });

    // Sort by month for proper interpolation
    labelPoints.sort((a, b) => a.month - b.month);

    // Handle extrapolation beyond the range
    if (xValue >= labelPoints[labelPoints.length - 1].month) {
      // Extrapolate beyond last label
      const last = labelPoints[labelPoints.length - 1];
      const secondLast = labelPoints[labelPoints.length - 2];
      const slope = (last.position - secondLast.position) / (last.month - secondLast.month);
      return last.position + slope * (xValue - last.month);
    }

    if (xValue <= labelPoints[0].month) {
      // Extrapolate before first label
      const first = labelPoints[0];
      const second = labelPoints[1];
      const slope = (second.position - first.position) / (second.month - first.month);
      return first.position + slope * (xValue - first.month);
    }

    // Interpolate between labels
    for (let i = 0; i < labelPoints.length - 1; i++) {
      const current = labelPoints[i];
      const next = labelPoints[i + 1];

      if (xValue >= current.month && xValue <= next.month) {
        // Linear interpolation
        const monthRange = next.month - current.month;
        const positionRange = next.position - current.position;
        const monthProgress = (xValue - current.month) / monthRange;
        return current.position + monthProgress * positionRange;
      }
    }

    // Fallback (shouldn't reach here)
    return labelPoints[0].position;
  };

  // Pixel-based marker positioning (fallback/hardcoded approach)
  const getPixelBasedMarkerPosition = (xValue: number): number => {
    // Chart width from HTML inspection: 468.9688px
    const chartWidth = 468.9688;

    // X-axis tick positions from HTML inspection (pixel positions)
    const tickPositions: { month: number; pixel: number }[] = [
      { month: 0, pixel: 0 },           // Mo 0
      { month: 20, pixel: 78.16146666666666 },  // Mo 20
      { month: 36, pixel: 156.3229333333333 },  // Yr 3
      { month: 60, pixel: 234.4844 },          // Yr 5
      { month: 72, pixel: 312.6458666666666 }, // Yr 6
      { month: 96, pixel: 390.80733333333336 }, // Yr 8
    ];

    // For values beyond the last tick, extrapolate linearly
    if (xValue >= tickPositions[tickPositions.length - 1].month) {
      const lastTick = tickPositions[tickPositions.length - 1];
      const secondLastTick = tickPositions[tickPositions.length - 2];
      const monthsPerPixel = (lastTick.month - secondLastTick.month) / (lastTick.pixel - secondLastTick.pixel);
      const extrapolatedPixel = lastTick.pixel + (xValue - lastTick.month) / monthsPerPixel;
      return Math.min((extrapolatedPixel / chartWidth) * 100, 100);
    }

    // For values within the tick range, interpolate between ticks
    for (let i = 0; i < tickPositions.length - 1; i++) {
      const currentTick = tickPositions[i];
      const nextTick = tickPositions[i + 1];

      if (xValue >= currentTick.month && xValue <= nextTick.month) {
        // Linear interpolation between ticks
        const monthRange = nextTick.month - currentTick.month;
        const pixelRange = nextTick.pixel - currentTick.pixel;
        const monthsFromCurrent = xValue - currentTick.month;
        const pixelPosition = currentTick.pixel + (monthsFromCurrent / monthRange) * pixelRange;
        return (pixelPosition / chartWidth) * 100;
      }
    }

    // Fallback for values before first tick
    return Math.max((xValue / tickPositions[0].month) * tickPositions[0].pixel / chartWidth * 100, 0);
  };

  // Main marker positioning function (chooses strategy based on props)
  const getMarkerPosition = (xValue: number): number => {
    return useLabelBasedPositioning
      ? getLabelBasedMarkerPosition(xValue)
      : getPixelBasedMarkerPosition(xValue);
  };

  // Calculate vertical offsets for marker labels to avoid collisions
  const calculateMarkerOffsets = (): number[] => {
    const offsets: number[] = [];
    const labelWidth = 60; // Approximate width of a label in pixels
    const labelHeight = 20; // Approximate height of a label in pixels
    const collisionThreshold = 8; // Minimum percentage difference to avoid collision

    timelineMarkers.forEach((marker, index) => {
      const leftPosition = getMarkerPosition(marker.x);
      let verticalOffset = 0;
      let collisionFound = true;
      let attempts = 0;
      const maxAttempts = 5; // Prevent infinite loops

      // Check for collisions with previously placed markers
      while (collisionFound && attempts < maxAttempts) {
        collisionFound = false;
        attempts++;

        for (let i = 0; i < index; i++) {
          const prevLeftPosition = getMarkerPosition(timelineMarkers[i].x);
          const prevOffset = offsets[i] || 0;

          // Check if labels overlap horizontally and vertically
          const horizontalOverlap = Math.abs(leftPosition - prevLeftPosition) < collisionThreshold;
          const verticalOverlap = Math.abs(verticalOffset - prevOffset) < labelHeight;

          if (horizontalOverlap && verticalOverlap) {
            verticalOffset += labelHeight + 2; // Stack below with small gap
            collisionFound = true;
            break;
          }
        }
      }

      offsets.push(verticalOffset);
    });

    return offsets;
  };

  const markerOffsets = calculateMarkerOffsets();

  return (
    <div
      ref={chartRef}
      style={{ position: 'relative', width: '100%', height: `${height}px`, paddingBottom: '50px' }}
    >
      <LineChart
        series={series}
        xDomain={[xDomain[0], xDomain[xDomain.length - 1]]}
        yDomain={undefined}
        i18nStrings={i18nStrings}
        ariaLabel={title || 'Line Chart'}
        height={height}
        xScaleType="linear"
        yTitle={yTitle}
        xTitle="Timeline"
        legendTitle="Legend"
        hideFilter={true}
      />

      {/* Timeline event markers */}
      {timelineMarkers.map((marker, index) => {
        const leftPosition = getMarkerPosition(marker.x);
        const markerColor = marker.color || '#FF8C00';
        const verticalOffset = markerOffsets[index] || 0;

        return (
          <TimelineMarker
            key={`marker-${index}`}
            marker={marker}
            leftPosition={leftPosition}
            markerColor={markerColor}
            index={index}
            verticalOffset={verticalOffset}
          />
        );
      })}
    </div>
  );
};
