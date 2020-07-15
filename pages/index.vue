<template>
  <v-container fill-height fluid>
    <v-row ref="table" justify="center" align="center">
      <v-col cols="4">
        <v-data-table
          :headers="headers"
          :items="allItems"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @click:row="allItemsRowClick($event)"
        />
      </v-col>
      <v-col cols="8">
        <bar-chart v-if="showChart" :key="idx" :data="barChartData" :options="barChartOptions" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import BarChart from '~/components/BarChart'

export default {

  components: {
    BarChart
  },

  async asyncData ({ $api }) {
    const { data } = await $api.Data.get()
    return { allItems: data.filter(x => x.Maker !== '' & x.Model !== '' & x.Count > 3) }
  },

  data () {
    return {
      idx: 0,
      showChart: false,

      windowSize: {
        x: 0,
        y: 0
      },
      headers: [
        {
          text: 'Maker',
          value: 'Maker'
        },
        {
          text: 'Model',
          value: 'Model'
        },
        {
          text: 'Year',
          value: 'Year'
        },
        {
          text: 'Count',
          value: 'Count'
        }
      ],
      sortBy: 'Count',
      sortDesc: true,
      barChartData: {
        datasets: [
          {
            data: [],
            backgroundColor: 'black'
          }
        ]
      },

      barChartOptions: {
        chartArea: {
          backgroundColor: 'red'
        },
        onClick: (element, dataAtClick) => {
          this.OpenAd(element, dataAtClick)
        },
        legend: { display: false },
        title: { display: true, text: '' },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: { }
          }],
          xAxes: [{
            ticks: { }
          }]
        }
      }
    }
  },

  mounted () {
    this.onResize()
  },

  methods: {

    OpenAd (element, dataAtClick) {
      const idx = dataAtClick[0]._index
      const data = this.barChartData.datasets[0].data[idx].data
      window.open('https://bland.is/classified/entry.aspx?classifiedId=' + data.Id, '_blank')
    },

    onResize () {
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
    },

    async allItemsRowClick (event) {
      this.showChart = false
      this.barChartData.datasets[0].data = []
      const { data } = await this.$api.Data.getByMakerModelYear(event.Maker, event.Model, event.Year)

      const result = []
      data.forEach(car => result.push({ y: car.Price / 1000, x: car.Driven / 1000, data: car }))
      this.barChartData.datasets[0].pointBackgroundColor = data.map(x => x.Sold ? 'red' : 'green')

      let yMin = Math.min.apply(Math, result.map(function (o) { return o.y }))
      let yMax = Math.max.apply(Math, result.map(function (o) { return o.y }))
      let xMin = Math.min.apply(Math, result.map(function (o) { return o.x }))
      let xMax = Math.max.apply(Math, result.map(function (o) { return o.x }))

      yMin = Math.floor(yMin * 0.95)
      yMax = Math.ceil(yMax * 1.05)
      xMin = Math.floor(xMin * 0.95)
      xMax = Math.ceil(xMax * 1.05)

      yMin = yMin - yMin % 100
      yMax = yMax - yMax % 100 + 100
      xMin = xMin - xMin % 100
      xMax = xMax - xMax % 100 + 100

      this.barChartOptions.scales.yAxes[0].ticks.min = yMin
      this.barChartOptions.scales.yAxes[0].ticks.max = yMax
      this.barChartOptions.scales.xAxes[0].ticks.min = xMin
      this.barChartOptions.scales.xAxes[0].ticks.max = xMax
      this.barChartOptions.title.text = `${event.Maker} ${event.Model} ${event.Year}`

      this.barChartData.datasets[0].data = result
      this.showChart = true
    }
  }
}
</script>
