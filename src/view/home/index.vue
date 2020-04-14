<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="店面性质"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="区域性质"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example :value="lineData" style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '新增用户', icon: 'md-person-add', count: 0, color: '#2d8cf0' },
        { title: '新增跟进', icon: 'md-help-circle', count: 0, color: '#19be6b' },
        { title: '新增合同', icon: 'md-contract', count: 0, color: '#ff9900' },
        { title: '新增服务', icon: 'md-heart', count: 0, color: '#ed3f14' },
        { title: '新增工单', icon: 'md-chatbubbles', count: 0, color: '#E46CBB' },
        { title: '新增培训', icon: 'md-train', count: 0, color: '#9A66E4' }
      ],
      pieData: [
        
      ],
      barData: {
        '一类': 0,
        '二类': 0,
        '三类': 0,
        '四类': 0,
        '五类': 0,
        '六类': 0
      },
      lineData: {x:[],y:[]}
    }
  },
  mounted () {
    this.init_dashboard()
  },
  methods: {
    init_dashboard() {
      this.$rest('dashboard/statistics_data')
      .get()
      .success(res => {
        this.inforCardData[0].count = res.franchisee
        this.inforCardData[1].count = res.follow_record
        this.inforCardData[2].count = res.contract
        this.inforCardData[3].count = res.service_record
        this.inforCardData[4].count = res.service_apply
        this.inforCardData[5].count = res.training
        this.pieData = res.address_did
        let i = 1
        for(let k in this.barData) {
          this.barData[k] = res.region_level[i]
          i++
        }
        this.lineData.x = res.week.map(_ => _.apply)
        this.lineData.y = res.week.map(_ => _.record)
        console.log(this.lineData)
      })
      .error(res => {
        this.$Message.error(res.message)
      })
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
