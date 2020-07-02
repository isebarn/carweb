<template>
  <v-container>
    <v-card-title primary-title>
      Updates
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="allItems"
    />
  </v-container>
</template>

<script>
export default {

  async asyncData ({ $api }) {
    const { data } = await $api.Data.logs()
    const result = []
    data.forEach(u => result.push({ Time: u.Time, New: u.Data.new.length, Sold: u.Data.sold.length }))
    return { allItems: result }
  },

  data () {
    return {
      headers: [
        {
          text: 'Date',
          value: 'Time'
        },
        {
          text: 'New',
          value: 'New'
        },
        {
          text: 'Sold',
          value: 'Sold'
        }
      ]
    }
  }
}
</script>
