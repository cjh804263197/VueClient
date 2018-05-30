
<template>
    <Modal v-model="tranData.visible" title="工资结算文件生成" @on-ok="handleSave" @on-cancel="handleCancel" @on-visible-change="visibleChange" :loading="modal_loading">
        <Form ref="saveForm" :model="filter" :rules="ruleValidate" :label-width="80">
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
            <FormItem slot="footer">
                <Button type="text" @click="handleCancel">取消</Button>
                <Button type="primary" @click="handleSave('formInline')">生成</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import { query_project_laborteam } from '@/api/project.js'
import { query_laborteam } from '@/api/laborteam.js'
import { create_settle_file } from '@/api/settlefile.js'
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
            projects: [],
            modal_loading: true
        }
    },
    props: {
        tranData: {
            type: Object,
            default: () => {
                return {visible: false}
            }
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
        handleSave () { // 保存按钮事件
            console.warn('save')
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要保存该条记录吗？</p>',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            let yms = this.filter.yearAndMonth.split('-')
                            create_settle_file({
                                laborTeamId: this.filter.laborTeamId, 
                                projectId: this.filter.projectId, 
                                year: parseInt(yms[0]),
                                month: parseInt(yms[1])
                            }).then(
                                res => {
                                    this.$Message.success('生成成功')
                                    this.$emit('success')
                                    this.tranData.visible = false
                                }
                            ).catch(
                                err => {
                                    if (err.response.status === 400) {
                                        this.$Message.error('生成失败， 原因：' + err.response.data.message)
                                    } else {
                                        this.$Message.error('生成失败')
                                        console.error(`err=${JSON.stringify(err)}`)
                                    }
                                    this.tranData.visible = false
                                }
                            )
                        },
                        onCancel: () => {
                            this.modal_loading = false
                        }
                    })
                } else {
                    this.$Message.warning('验证不通过')
                    console.warn('验证不通过')
                    this.modal_loading = false
                }
            })
        },
        handleCancel () {
            this.$refs['saveForm'].resetFields()
        },
        visibleChange (visible) {
            console.warn(visible?'显示了':'隐藏了')
            if (visible) { // 当模态框显示时
                this.getLaborTeams()
            } else { // 当模态框关闭时,重置表单
                    this.$refs['saveForm'].resetFields()
                    this.filter = { 
                        yearAndMonth: '',
                        laborTeamId: '',
                        projectId: ''
                    }
            }
        }
    }
}
</script>
