// @ts-ignore
import Plot from 'react-plotly.js';
export function Histogram() {
    return <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        useResizeHandler={true}
        style={{width: '100%', height: '100%'}}
        config={{displayModeBar:false}}
      />
}
