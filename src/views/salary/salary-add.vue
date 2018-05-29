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
                    <Button type="primary" icon="ios-plus" @click="handleAdd('formInline')">新增工资</Button>
                </FormItem>
            </Form>
        </Row>

        <Row class="searchable-table-con1">
            <!-- 一个可编辑和加载状态的Table -->
            <can-edit-table
            refs="salaryTable"
            v-model="salarys"
            @on-cell-change="handleCellChange"
            @on-change="handleChange"
            :editIncell="true"
            :columns-list="columns"
            ></can-edit-table>
        </Row>
    </div>
</template>

<script>
import { query_project_laborteam } from '@/api/project.js'
import { query_laborteam } from '@/api/laborteam.js'
import { save_salary, batch_create_salary } from '@/api/salary.js'
import Cookies from 'js-cookie'
import { checkTime, getMonthDay } from '@/libs/CommonUtil.js'
import canEditTable from './components/canEditTable'
export default {
    components: {
        'can-edit-table': canEditTable
    },
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
            projects: [],
            salarys: [],
            columns: [
                {
                    title: '项目',
                    key: 'projectTitle',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '劳务队',
                    key: 'laborTeamTitle',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '劳务人员',
                    key: 'laborName',
                    width: 80,
                    align: 'center'
                },
                {
                    title: '年',
                    key: 'year',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '月',
                    key: 'month',
                    width: 50,
                    align: 'center'
                },
                {
                    title: '应出勤天数',
                    key: 'standardAttendDay',
                    align: 'center',
                    editable: true
                },
                {
                    title: '实出勤天数',
                    key: 'actualAttendDay',
                    align: 'center',
                    editable: true
                },
                {
                    title: '工资',
                    key: 'money',
                    align: 'center',
                    editable: true
                },
                {
                    title: '操作',
                    key: 'handle',
                    align: 'center',
                    width: 100,
                    handle: ['edit']
                }
            ]
        }
    },
    computed: {
        selectedLaborTeam () {
            let results = this.laborTeams.filter(item => {
                return item.id === this.filter.laborTeamId
            })
            if (results.length > 0) {
                return results[0]
            } else {
                return {}
            } 
        },
        selectedProject () {
            let results = this.projects.filter(item => {
                return item.Project.id === this.filter.projectId
            })
            if (results.length > 0) {
                return results[0]
            } else {
                return {}
            } 
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
            let ymd_last = `${ym}-${getMonthDay(ym)}` // 取当前月份的最后一天
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
        handleAdd (name) { // 新增工资按钮事件
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let yms = this.filter.yearAndMonth.split('-')
                    batch_create_salary({
                        laborTeamId: this.filter.laborTeamId, 
                        projectId: this.filter.projectId, 
                        year: parseInt(yms[0]),
                        month: parseInt(yms[1])
                    }).then(
                        res => {
                            this.salarys = res.map(item => {
                                return {...item, laborTeamTitle: this.selectedLaborTeam.title, projectTitle: this.selectedProject.Project.title}
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
                } else {
                    this.$Message.warning('查询条件验证不通过')
                }
            })
        },
        handleCellChange (val, index, key) {
            // this.$Message.success(`修改了第${index}行,列名为${key}的数据为${val[index][key]}`)
            let param = {
                id: val[index].id,
                [key]: parseFloat(val[index][key])
            }
            save_salary(param).then(
                res => {
                    this.$Message.success('修改成功')
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
        handleChange (val, index) {
            // this.$Message.success(`修改了第${index}行的数据`)
            save_salary(val[index]).then(
                res => {
                    this.$Message.success('修改成功')
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
        }
    }
}
</script>

