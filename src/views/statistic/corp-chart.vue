<template>
    <div style="width: 100%; height: 600px;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts'
import { corp_statistic } from '../../api/corp.js'
export default {
    name: 'dataSourcePie',
    data () {
        return {
            chartBar: null
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.initChartBar()
            this.query()
        })      
    },
    methods: {
        initChartBar () {
            this.chartBar = echarts.init(document.getElementById('data_source_con'))
        },
        drawBarChart (res) {
            let option = {
                title: {
                    text: '企业分类状态统计'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['已审核', '未审核']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: res.kindList
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                series: [
                {
                    name: '已审核',
                    type: 'bar',
                    data: res.effList
                },
                {
                    name: '未审核',
                    type: 'bar',
                    data: res.invList
                }
                ]
            }
            this.chartBar.setOption(option)
            // 窗体大小改变时，图表随窗体大小改变
            window.addEventListener('resize', () => {
                this.chartBar.resize()
            })
        },
        query () {
            corp_statistic({}).then(
                res => {
                    console.warn(res)
                    this.drawBarChart(res)
                }
            ).catch(
                err => {
                    console.error(err)
                }
            )
        }
    }
}
</script>
