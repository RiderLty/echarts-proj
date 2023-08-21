
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


const rawData = [
  [ "2016.01", "2019.06", "2020.01", "2022.01","2026.8"],
  [ "2015.03", "2019.12", "2021.04",],
  [ "2016.01", "2019.06", "2020.01", "2022.01","2026.8"],
  [ "2015.03", "2019.12", "2021.04",],
  [ "2016.01", "2019.06", "2020.01", "2022.01","2026.8"],
  [ "2015.03", "2019.12", "2021.04",],
  [ "2016.01", "2019.06", "2020.01", "2022.01","2026.8"],
  [ "2015.03", "2019.12", "2021.04",],
  [ "2016.01", "2019.06", "2020.01", "2022.01","2026.8"],

]

const mkData = (raw) => {
  const monthsDiff = raw.map(row => row.map(data => ym2num(data)))
  const offsetData = monthsDiff.map(row => absData2offset(row))
  return offsetData
}

const mkSeries = (data) => {
  const maxLen = Math.max(...data.map(subArray => subArray.length))
  const fillZero = data.map(row => row.length >= maxLen ? row : [...row, ...Array(maxLen - row.length).fill(0)])
  const transposeData = fillZero[0].map((_, colIndex) => fillZero.map(row => row[colIndex]))
  return transposeData.map((row,index) => ({
    name: `bar${index}`,
    type: 'bar',
    stackStrategy: "all",
    stack: 'one',
    emphasis: emphasisStyle,
    color: index === 0 ? "#FFFFFF00" : '',
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

const emphasisStyle = {
  itemStyle: {
    shadowBlur: 10,
    shadowColor: 'rgba(0,0,0,0.3)'
  }
};
function App() {
  return <div style={{ width: "100vw", height: "100vh" }}>
    <EchartsRender
      options={{
        title: {
          text: '主标题',
          subtext: '副标题'
        },
        tooltip: {
          // trigger: 'axis',
          // axisPointer: {
          //   type: 'shadow'
          // },
          // formatter: (params) => {
          //   const tar = params[1];
          //   return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
          // }
        },
        legend: {
          data: ['bar', 'bar2', 'bar3', 'bar4'],
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
          // top:"16%",
          left: '3%',
          right: '3%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          // splitLine: { show: false },
          data: ['张三', '李四','张三', '李四','张三', '李四','张三', '李四','张三'],
          axisLine: { onZero: true },
          splitLine: { show: false },
          splitArea: { show: false },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: (val) => num2ym(val)// 应用自定义的格式化函数
          },
          interval:12,
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
