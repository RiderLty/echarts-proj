
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import EchartsRender from './components/EchartsRender';

function App() {
  return <div style={{width:"100vw",height:"100vh"}}>
    <EchartsRender
      options={{
        title: {
          text: '高考理科分数占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: ['语文', '物理', '数学', '化学', '英语', '生物']
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '分数',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            data: [
              { value: 150, name: '语文' },
              { value: 110, name: '物理' },
              { value: 150, name: '数学' },
              { value: 100, name: '化学' },
              { value: 150, name: '英语' },
              { value: 90, name: '生物' },
            ]
          }
        ]
      }}
      style={{
        with:"100%",
        height:"100%"
      }}
    />
  </div>
}

export default App;
