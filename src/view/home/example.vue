<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
export default {
  name: 'serviceRequests',
  props: {
    value: {
      type: Object,
      default:()=>{
        return {
          x:[],
          y:[]
        }
      }
    }
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  computed: {
    option() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '3%',
          left: '1.2%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '工单次数',
            type: 'line',
            stack: '总量',
            smooth:true,
            areaStyle: {normal: {
              color: '#2d8cf0'
            }},
            data: this.value.x
          },
          {
            name: '服务次数',
            type: 'line',
            stack: '总量',
            smooth:true,
            areaStyle: {normal: {
              color: '#398DBF'
            }},
            data: this.value.y
          }
        ]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(this.option)
      on(window, 'resize', this.resize)
    })
  },
  watch: {
    value: {
      handler:function() {
        this.dom.setOption(this.option)
      },
      deep: true
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
