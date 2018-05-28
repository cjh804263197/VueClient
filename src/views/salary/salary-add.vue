<template>
    <div>
        <Row class="margin-top-20">
            <!-- 生成面板 -->
            <Form ref="formInline" :model="filter" :rules="ruleValidate" inline>
                <FormItem prop="yearAndMonth">
                    <DatePicker type="month" v-model="filter.yearAndMonth" format="yyyy-MM" @on-change="yearMonthChange" placeholder="请选择年月" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem prop="laborTeamId">
                    <Select v-model="filter.laborTeamId" placeholder="请选择劳务队" @on-change="laborTeamChange" clearable style="width: 200px;">
                        <Option v-for="item in laborTeams" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="projectId">
                    <Select v-model="filter.projectId" placeholder="请选择项目" clearable style="width: 200px;">
                        <Option v-for="item in projects" :value="item.Project.id" :key="item.Project.id">{{ item.Project.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="ios-plus" @click="handleAdd">新增工资</Button>
                </FormItem>
            </Form>
        </Row>

        <Row class="searchable-table-con1">
            <!-- 一个可编辑和加载状态的Table -->

        </Row>
    </div>
</template>

<script>
import { query_project, query_project_laborteam } from '@/api/project.js'
import { query_laborteam } from '@/api/laborteam.js'
import Cookies from 'js-cookie'
import { checkTime, getMonthDay } from '@/libs/CommonUtil.js'
export default {
    data () {
        return {
            loginUser: JSON.parse(Cookies.get('user')),
            filter: {
                yearAndMonth: '',
                laborTeamId: '',
                projectId: ''
            },
            ruleValidate: {
                yearAndMonth: [
                    { required: true, message: '工资年月不能为空', trigger: 'change' }
                ],
                laborTeamId: [
                    { required: true, message: '劳务队不能为空', trigger: 'change' }
                ],
                projectId: [
                    { required: true, message: '项目不能为空', trigger: 'change' }
                ]
            },
            laborTeams: [],
            projects: []
        }
    },
    created () {
        this.getLaborTeams()
    },
    methods: {
        getLaborTeams () {
            query_laborteam({corpId: this.loginUser.corpId}).then(
                res => {
                    this.laborTeams = res.rows
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
        getProjects (ym, lti) { // 获取项目选择数据 通过年月以及劳务队id
            this.filter.projectId = ''
            if (ym === '') {
                this.$Message.warning('请选择年月')
                this.projects = []
                return
            }
            if (lti === '') {
                this.projects = []
                return
            }
            let ymd_first = `${ym}-01` // 取所选择月份的第一天
            let ymd_last = `${ym}-${getMonthDay(ym)}` // 去当前月份的最后一天
            console.warn(`ymd_last=${getMonthDay(ym)}`)
            query_project_laborteam({laborTeamId: lti}).then(
                res => {
                    this.projects = res.rows.filter(item => {
                        // console.warn(`F=${checkTime(item.effectiveDate, item.invaildDate, ymd_first)} L=${checkTime(item.effectiveDate, item.invaildDate, ymd_last)}`)
                        return checkTime(item.effectiveDate, item.invaildDate, ymd_first) || checkTime(item.effectiveDate, item.invaildDate, ymd_last)
                    })
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
        yearMonthChange (value, value1) { // 年月改变触发事件
            this.filter.yearAndMonth = value
            this.getProjects(value, this.filter.laborTeamId)
        },
        laborTeamChange (value) { // 劳务队改变触发事件
            this.getProjects(this.filter.yearAndMonth, value)
        },
        handleAdd () { // 新增工资

        }
    }
}
</script>

