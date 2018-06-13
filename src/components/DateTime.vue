<template>
  <div>
    <small>{{getDateTime}}</small>
  </div>
</template>

<script>
export default {
  props: ['date', 'time'],
  computed: {
    getDateTime () {
      if (this.time.length === 0 && this.date !== null) {
        let a = new Date(this.date)
        a = a.toLocaleString().split(' ')[0]
        a = a.slice(0, a.length - 1)
        return a
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
