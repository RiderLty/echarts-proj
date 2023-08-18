
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

const absData2Series = (list) => {
  const birthday = list[0]
  let ptr = birthday
  const offset = []
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    offset.push(element - ptr  )
    ptr -= element
  }
  return offset
}


const rawData = [
  ["1966.12", "2016.01", "2019.06", "2020.01", "2022.01",],
  ["1967.06", "2015.03", "2019.12", "2021.04",],
]

const mkData = (raw) => {
  const  monthsDiff = rawData.map( row => row.map(data => ym2num(data)))
  const fillEmpty = []


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
          type: 'value'
        },
        series: [
          {
            name: 'Life Cost',
            type: 'bar',
            stack: 'Total',
            data: [2000, 1300]
          },
          {
            name: 'Life Cost',
            type: 'bar',
            stack: 'Total',
            color: "#d90051",
            data: [2000, 1300, 0, 200, 900, 300]
          },

        ]
      }}
      style={{
        with: "100%",
        height: "100%"
      }}
    />
  </div>
}

export default App;
