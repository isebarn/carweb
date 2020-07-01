import { Scatter } from 'vue-chartjs'

export default {
  extends: Scatter,
  props: ['data', 'options'],
  mounted () {
    this.addPlugin({
      id: 'my-plugin',
      afterDraw (chart, easing) {
        const ctx = chart.chart.ctx
        const chartArea = chart.chartArea
        const style = 'rgba(169,169,169, 1)'

        const yAxisData = chart.config.data.datasets[0].data.map(x => x.y)
        const yAvg = yAxisData.reduce((a, b) => a + b, 0) / yAxisData.length
        const height = chartArea.bottom - chartArea.top
        const yAxis = chart.scales['y-axis-1']
        const yAxisRange = yAxis.end - yAxis.start
        const y = chartArea.bottom - ((yAvg - yAxis.start) * height / yAxisRange)

        ctx.beginPath()
        ctx.moveTo(chartArea.left, y)
        ctx.lineTo(chartArea.right, y)
        ctx.strokeStyle = style
        ctx.stroke()

        const xAxisData = chart.config.data.datasets[0].data.map(x => x.x)
        const xAvg = xAxisData.reduce((a, b) => a + b, 0) / xAxisData.length
        const width = chartArea.right - chartArea.left
        const xAxis = chart.scales['x-axis-1']
        const xAxisRange = xAxis.end - xAxis.start
        const x = chartArea.left + ((xAvg - xAxis.start) * width / xAxisRange)

        ctx.beginPath()
        ctx.moveTo(x, chartArea.top)
        ctx.lineTo(x, chartArea.bottom)
        ctx.strokeStyle = style
        ctx.stroke()

        ctx.restore()
      }
    })

    this.renderChart(this.data, this.options)
  }
}
