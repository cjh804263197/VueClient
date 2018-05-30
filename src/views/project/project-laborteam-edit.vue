
<template>
    <Modal v-model="tranData.visible" :title="title" @on-ok="handleSave" @on-cancel="handleCancel" @on-visible-change="visibleChange" :loading="modal_loading">
        <Form ref="saveForm" :model="saveForm" :rules="ruleValidate" :label-width="80">
            <FormItem label="分配项目" prop="projectId">
                <Select v-model="saveForm.projectId" placeholder="请选择所要分配的项目" clearable>
                    <Option v-for="item in projects" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
            </FormItem>
            <FormItem label="劳务公司" prop="laborCorpId">
                <Select v-model="saveForm.laborCorpId" placeholder="请选择所要分配的劳务公司" @on-change="laborCorpChange" clearable>
                    <Option v-for="item in laborCorps" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
            </FormItem>
            <FormItem label="劳务队" prop="laborTeamId">
                <Select v-model="saveForm.laborTeamId" placeholder="请选择所要分配的劳务队" clearable>
                    <Option v-for="item in laborTeams" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
            </FormItem>
            <FormItem label="生效日期" prop="effectiveDate">
                <DatePicker type="date" placeholder="请选择生效日期" v-model="saveForm.effectiveDate"></DatePicker>
            </FormItem>
            <FormItem label="失效日期" prop="invaildDate">
                <DatePicker type="date" placeholder="请选择失效日期" v-model="saveForm.invaildDate"></DatePicker>
            </FormItem>
            <FormItem slot="footer">
                <Button type="text" @click="handleCancel">取消</Button>
                <Button type="primary" @click="handleSave">保存</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import { query_laborteam } from '@/api/laborteam.js'
import { get_project_laborteam, save_project_laborteam, query_project } from '@/api/project.js'
import {query_corp} from '@/api/corp.js'
import Cookies from 'js-cookie'
export default {
    data () {
        return {
            saveForm: { // 保存的form对象
                projectId: '',
                laborCorpId: '',
                laborTeamId: '',
                effectiveDate: new Date(),
                invaildDate: new Date()
            },
            projects: [], // 存放可选则的项目列表
            laborCorps: [], // 存放可选择的劳务公司列表
            laborTeams: [], // 存放可选择的劳务队列表
            currentUser: JSON.parse(Cookies.get('user')),
            ruleValidate: { // 表单校验
                projectId: [
                    { required: true, message: '分配项目不能为空', trigger: 'change' }
                ],
                laborCorpId: [
                    { required: true, message: '劳务公司不能为空', trigger: 'change' }
                ],
                laborTeamId: [
                    { required: true, message: '劳务队不能为空', trigger: 'change' }
                ],
                effectiveDate: [
                    { required: true, type: 'date', message: '生效日期不能为空', trigger: 'change' }
                ],
                invaildDate: [
                    { required: true, type: 'date', message: '失效日期不能为空', trigger: 'change' }
                ]
            },
            modal_loading: true
        }
    },
    props: {
        tranData: {
            type: Object,
            default: () => {
                return {visible: false, edit: false, title: '', id: ''}
            }
        }
    },
    computed: {
        title () {
            return this.tranData.edit ? `修改${this.tranData.title}` : `添加${this.tranData.title}`
        }
    },
    created () {
        this.getProjectList()
        this.getLaborCorpList()
    },
    methods: {
        getProjectList () { // 加载项目列表
            query_project({constructCorpId: this.currentUser.corpId ? this.currentUser.corpId : '', status: '已审核'}).then(
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
        getLaborCorpList () { // 加载劳务公司列表
            query_corp({status: '已审核', kind: '劳务公司'}).then(
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
        getLaborTeamList (laborCorpId='') { // 根据所选劳务公司加载劳务队列表
            if (laborCorpId === '') {
                this.saveForm.laborTeamId = ''
                this.laborTeams = []
                return
            }
            query_laborteam({corpId: laborCorpId}).then(
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
        laborCorpChange (value) {
            console.warn(`laborCorpChange,value=${value}`)
            this.getLaborTeamList(value)
        },
        handleSave () {
            console.warn('save')
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要保存该条记录吗？</p>',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            save_project_laborteam(this.saveForm).then(
                                res => {
                                    this.$Message.success('保存成功')
                                    this.$emit('success')
                                    this.tranData.visible = false
                                }
                            ).catch(
                                err => {
                                    if (err.response.status === 400) {
                                        this.$Message.error('保存失败， 原因：' + err.response.data.message)
                                    } else {
                                        this.$Message.error('保存失败')
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
                if (this.tranData.edit) { // 当父组件传来编辑是true时，表明将要修改，则需获取到该编辑对象
                    this.getObjectById()
                }
            } else { // 当模态框关闭时,重置表单
                this.$refs['saveForm'].resetFields()
                this.saveForm = { 
                    projectId: '',
                    laborCorpId: '',
                    laborTeamId: '',
                    effectiveDate: new Date(),
                    invaildDate: new Date()
                }
                console.warn('重置了')
            }
        },
        getObjectById () { // 通过父组件传来的id,获取到该对象
            get_project_laborteam(this.tranData.id).then(
                res => {
                    console.warn(`res=${JSON.stringify(res)}`)
                    this.saveForm = res
                }
            ).catch (
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
