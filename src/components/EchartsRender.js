import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const EchartsRender = ({ options, style }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    chartInstance.current.setOption(options);
    return () => {
      chartInstance.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(options);
    }
  }, [options]);

  return <div ref={chartRef} style={style} />;
};

export default EchartsRender;