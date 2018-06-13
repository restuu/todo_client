<template>
  <div>
    {{getDateTime}}
  </div>
</template>

<script>
export default {
  props: ['date', 'time'],
  computed: {
    getDateTime () {
      if (this.time.length === 0 && this.date !== null) {
        return new Date(this.date).toDateString()
      } else if (this.date === null) {
        return
      }
      let indexT = this.date.indexOf('T')
      let dateStr = this.date.slice(0, indexT)
      return new Date(dateStr + 'T' + this.time).toLocaleString()
    }
  }
}
</script>

<style>

</style>
