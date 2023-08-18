
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import EchartsRender from './components/EchartsRender';


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
  const currentDate = new Date();
  const targetDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + monthsDiff,
    1
  );
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  return `${targetYear}.${targetMonth}`;
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


const rawData = [
  ["1966.12", "2016.01", "2019.06", "2020.01", "2022.01","2035.6"],
  ["1967.06", "2015.03", "2019.12", "2021.04",],
]

const mkData = (raw) => {
  const monthsDiff = rawData.map(row => row.map(data => ym2num(data)))
  const offsetData = monthsDiff.map(row => absData2offset(row))
  return offsetData
}

const mkSeries = (data) => {
  const maxLen = Math.max(...data.map(subArray => subArray.length))
  const fillZero = data.map(row => row.length >= maxLen ? row : [...row, ...Array(maxLen - row.length).fill(0)])
  const transposeData = fillZero[0].map((_, colIndex) => fillZero.map(row => row[colIndex]))
  return transposeData.map((row,index) => ({
    name: 'Life Cost',
    type: 'bar',
    stackStrategy: "all",
    stack: 'one',
    color: index === 0 ? "#FFFFFF00" : getRandomColor(),
    data: row
  }))
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function App() {
  return <div style={{ width: "100vw", height: "100vh" }}>
    <EchartsRender
      options={{
        title: {
          text: '年限统计',
          subtext: '滁州市财政局'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            const tar = params[1];
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          splitLine: { show: false },
          data: ['张三', '李四']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (val) => num2ym(val)+"年" // 应用自定义的格式化函数
          }
        },
        series:mkSeries(mkData(rawData))
      }}
      style={{
        with: "100%",
        height: "100%"
      }}
    />
  </div>
}

export default App;
