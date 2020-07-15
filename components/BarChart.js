import { Scatter } from 'vue-chartjs'
import { std, mean } from 'mathjs'

export default {
  extends: Scatter,
  props: ['data', 'options'],
  mounted () {
    this.addPlugin({
      id: 'my-plugin',
      beforeDraw (chart, easing) {
        const ctx = chart.chart.ctx
        const chartArea = chart.chartArea
        const style = 'rgba(169,169,169, 1)'

        const yAxisData = chart.config.data.datasets[0].data.map(x => x.y)
        const yAvg = mean(yAxisData)
        const yStd = std(yAxisData)
        const height = chartArea.bottom - chartArea.top
        const yAxis = chart.scales['y-axis-1']
        const yAxisRange = yAxis.end - yAxis.start
        const y = chartArea.bottom - ((yAvg - yAxis.start) * height / yAxisRange)
        const ystd = chartArea.bottom - ((yAvg - yAxis.start + yStd) * height / yAxisRange)

        const xAxisData = chart.config.data.datasets[0].data.map(x => x.x)
        const xAvg = mean(xAxisData)
        const xStd = std(xAxisData)
        const width = chartArea.right - chartArea.left
        const xAxis = chart.scales['x-axis-1']
        const xAxisRange = xAxis.end - xAxis.start
        const x = chartArea.left + ((xAvg - xAxis.start) * width / xAxisRange)
        const xstd = chartArea.left + ((xAvg - xAxis.start - xStd) * width / xAxisRange)

        // std deviation on the graph
        ctx.fillStyle = 'rgba(250, 227, 255, 0.4)'
        ctx.fillRect(xstd, chartArea.top, xStd * 2 * width / xAxisRange, height)
        ctx.fillRect(chartArea.left, ystd, width, yStd * 2 * height / yAxisRange)

        // avg price
        ctx.beginPath()
        ctx.moveTo(chartArea.left, y)
        ctx.lineTo(chartArea.right, y)
        ctx.strokeStyle = style
        ctx.stroke()

        // avg driven
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
