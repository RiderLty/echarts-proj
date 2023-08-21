
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import EchartsRender from './components/EchartsRender';
import XlsxReader from './components/XlsxReader';


const ym2num = (dateString) => {//输入形如 1994.8  2023.7 返回距离当前日期的月数
  const [year, month] = dateString.split('.');
  const targetYear = parseInt(year, 10);
  const targetMonth = parseInt(month, 10);
  const currentDate = new Date();
  const targetDate = new Date(targetYear, targetMonth - 1, 1);
  const monthsDiff = (currentDate.getFullYear() - targetDate.getFullYear()) * 12 +
    (currentDate.getMonth() - targetDate.getMonth());
  return monthsDiff * -1;
}

const num2ym = (monthsDiff) => {
  if (monthsDiff === 0) return "现在"
  const currentDate = new Date();
  const targetDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + monthsDiff,
    1
  );
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  return `${targetYear}年${targetMonth}月`;
};

const absData2offset = (list) => {
  const tmp = [list[0]]
  let ptr = list[0]
  for (let index = 1; index < list.length; index++) {
    const element = list[index];
    tmp.push(element - ptr)
    ptr = element
  }
  return tmp
}

const makeDateLine = (line) => {
  const list = []
  for (let item of line) {
    try {
      if (!isNaN(ym2num(item))) {
        list.push(ym2num(item))
      }
    } catch (e) {
      console.warn(e)
    }
  }
  return list
}


const mkData = (raw) => {
  const monthsDiff = raw.map(line => makeDateLine(line))
  const appendZero = monthsDiff.map(line => line[line.length - 1] < 0 ? [...line, 0] : line)
  return appendZero
}

const mkSeries = (rawData, nameList) => {
  const data = rawData.map(line => absData2offset(line))
  const maxLen = Math.max(...data.map(subArray => subArray.length))
  const fillZero = data.map(row => row.length >= maxLen ? row : [...row, ...Array(maxLen - row.length).fill(0)])
  const transposeData = fillZero[0].map((_, colIndex) => fillZero.map(row => row[colIndex]))
  return transposeData.map((row, index) => ({
    name: index === 0 ? "" : `${nameList[index - 1]}`,
    type: 'bar',
    stackStrategy: "all",
    stack: 'one',
    emphasis: emphasisStyle,
    color: index === 0 ? "#FFFFFF00" : '',
    data: row
  }))
}

const emphasisStyle = {
  itemStyle: {
    shadowBlur: 10,
    shadowColor: 'rgba(0,0,0,0.3)'
  }
};
function App() {
  const chartData = useRef(null)
  const [chartOptions, setChartOptions] = useState({
    title: {
      text: 'ECP',
      subtext: 'build ver0.0.0'
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        // console.log(params.dataIndex, params.seriesIndex,)
        return params.name + "<br/>"
          + `${chartData.current[params.dataIndex][params.seriesIndex - 1]} 至 ${chartData.current[params.dataIndex][params.seriesIndex]}` + "<br/>"
          + params.seriesName
      }
    },
    legend: {
      data: [],
      left: '10%'
    },
    brush: {
      toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
      xAxisIndex: 0
    },
    toolbox: {
      feature: {
        magicType: {
          type: ['stack']
        },
        dataView: {}
      }
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      data: [],
      axisLine: { onZero: true },
      splitLine: { show: false },
      splitArea: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (val) => num2ym(val)// 应用自定义的格式化函数
      },
      interval: 12,
    },
    series: []
  })

  const handelDataChange = (data) => {
    if (data[0][0] !== "姓名") {
      alert("表格式错误")
      return
    }
    const removeEmpty = data.filter(line => line.length > 0)
    const ensureString = removeEmpty.map(line => line.map(item => String(item)))
    const nameList = ensureString.map(line => line[0]).slice(1)
    const posList = ensureString[0].slice(1)
    const dataMatrix = ensureString.map(line => line.slice(1)).slice(1)
    chartData.current = mkData(dataMatrix).map(line => line.map(item => num2ym(item)))
    setChartOptions({
      legend: {
        data: posList,
        type: 'scroll',
        // selectedMode:false,
      
      },
      xAxis: {
        data: nameList,

      },
      dataZoom: {
        type: 'slider', // 缩放滑动条
        // start: 0, // 初始缩放范围的起始位置
        // end: 50   // 初始缩放范围的结束位置
      },
      series: mkSeries(mkData(dataMatrix), posList)
    })
  }


  return <div style={{ width: "100vw", height: "95vh" }}>
    <XlsxReader
      onDataRead={handelDataChange}
    />
    {
      <EchartsRender
        options={chartOptions}
        style={{
          with: "100%",
          height: "100%"
        }}
      />
    }
  </div>
}

export default App;
