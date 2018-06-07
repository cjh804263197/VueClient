<template>
    <div>
        <Row class="margin-top-20">
            <!-- 查询面板 -->
            <Form ref="formInline" :model="filter" inline>
                <FormItem prop="yearAndMonth">
                    <DatePicker type="month" v-model="filter.yearAndMonth" format="yyyy-MM" @on-change="yearMonthChange" placeholder="年月筛选" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem prop="project">
                    <Select v-model="filter.projectId" clearable placeholder="项目筛选" style="width: 200px;">
                        <Option v-for="item in projects" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="laborCorp">
                    <Select v-model="filter.laborCorpId" clearable placeholder="劳务公司筛选" style="width: 200px;">
                        <Option v-for="item in laborCorps" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="ios-search-strong" @click="query()">查询</Button>
                </FormItem>
            </Form>
        </Row>
        <Row>
            <div style="width:100%; height:500px;" id="data_source_con"></div>
        </Row>
    </div>
</template>

<script>
import echarts from 'echarts'
import { query_corp } from '../../api/corp.js'
import { query_project } from '../../api/project.js'
import { salary_statistic } from '../../api/salary.js'
export default {
    name: 'dataSourcePie',
    data () {
        return {
            chartBar: null,
            filter: {
                yearAndMonth: '',
                projectId: '',
                laborCorpId: '' ,
            },
            tranData: {
                visible: false,
                id: ''
            },
            projects: [],
            laborCorps: []
        }
    },
    created () {
        this.getProjects()
        this.getLaborCorps()
    },
    mounted () {
        this.$nextTick(() => {
            this.initChartBar()
            this.query()
        })
    },
    methods: {
        getProjects () { // 获取可选项目的数组
            let param = {status: '已审核'}
            query_project(param).then(
                res => {
                    this.projects = res.rows
                }
            ).catch(
                err => {
                    if (err.response.status === 400) {
                        this.$Message.error(err.response.data.message)
                    } else {
                        console.error(`err=${JSON.stringify(err)}`)
                    }
                }
            )
        },
        getLaborCorps () { // 获取可选劳务公司的数组
            let param = { status: '已审核', kind: '劳务公司' }
            query_corp(param).then(
                res => {
                    this.laborCorps = res.rows
                }
            ).catch(
                err => {
                    if (err.response.status === 400) {
                        this.$Message.error(err.response.data.message)
                    } else {
                        console.error(`err=${JSON.stringify(err)}`)
                    }
                }
            )
        },
        yearMonthChange (value) { // 年月值改变事件
            this.filter.yearAndMonth = value
        },
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
            console.warn(this.filter.yearAndMonth)
            let year = new Date().getFullYear()
            let month = new Date().getMonth() + 1
            console.warn(`current year=${year} month=${month}`)
            if (this.filter.yearAndMonth !== '') {
                let yms = this.filter.yearAndMonth.split('-')
                year = parseInt(yms[0])
                month = parseInt(yms[1])
            }
            salary_statistic({projectId: this.filter.projectId, corpId: this.filter.laborCorpId, year, month}).then(
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
