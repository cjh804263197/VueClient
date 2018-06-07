<template>
    <div style="width:100%; height:500px;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts'
import { project_statistic } from '../../api/project.js'
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
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    data: ['ios', 'android', 'pc', 'web', 'others']
                },
                series: [
                    {
                        name: '项目状态统计',
                        type: 'pie',
                        radius: '66%',
                        center: ['50%', '60%'],
                        data: res,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
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
            project_statistic({}).then(
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
