<template>
  <div>
        <Row class="margin-top-20">
            <!-- 查询面板 -->
            <Form ref="formInline" :model="filter" inline>
                <FormItem prop="projectId" v-if="projectSelectVisible" style="width: 200px;">
                    <Select v-model="filter.projectId" clearable placeholder="项目筛选">
                        <Option v-for="item in projects" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="laborCorpId">
                    <Select v-model="filter.laborCorpId" :clearable="projectSelectVisible" placeholder="劳务公司筛选" @on-change="laborCorpChange" style="width: 200px;">
                        <Option v-for="item in laborCorps" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="laborTeamId">
                    <Select v-model="filter.laborTeamId" placeholder="劳务队筛选" clearable style="width: 200px;">
                        <Option v-for="item in laborTeams" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="ios-search-strong" @click="handleQuery">查询</Button>
                    <Button type="success" icon="ios-plus" @click="handleAdd">添加</Button>
                </FormItem>
            </Form>
        </Row>

        <Row class="searchable-table-con1">
            <!-- 一个带斑马纹和加载状态的Table -->
            <Table stripe :loading="loading" :columns="columns" :data="datas"></Table>
            <!-- 分页控件 -->
            <Page style="float: right;" :transfer="true" :current.sync="currentPage" :page-size="limit" :total="total" @on-change="currentPageChange" show-total></Page>
        </Row>

        <project-laborteam-edit :tranData="tranData" @success="handleQuery"></project-laborteam-edit>

    </div>
</template>

<script>
import { query_corp } from '@/api/corp.js'
import { query_project, query_project_laborteam } from '@/api/project.js'
import { query_laborteam } from '@/api/laborteam.js'
import projectLaborTeamEdit from './project-laborteam-edit'
import Vue from 'vue'
import Cookies from 'js-cookie'
import { checkTime } from '@/libs/CommonUtil.js'
export default {
    components: {
        'project-laborteam-edit': projectLaborTeamEdit
    },
    data () {
        return {
            loginUser: JSON.parse(Cookies.get('user')),
            loading: false,
            filter: { // 查询条件
                projectId: '', // 项目Id
                laborCorpId: JSON.parse(Cookies.get('user')).position === '劳务公司经理' ? JSON.parse(Cookies.get('user')).corpId : '', // 劳务公司
                laborTeamId: '' // 劳务队
            },
            tranData: { // 向编辑数据模态框传值
                visible: false,
                edit: false,
                title: '分配关系',
                id: ''
            },
            projects: [],
            laborCorps: [],
            laborTeams: [],
            datas: [], // 存放查询结果数据
            total: 0, // 查询总记录数
            currentPage: 1, // 当前页
            limit: 10, // 页大小
            columns: [
                {
                    title: '项目名称',
                    key: 'Project.title',
                    render: (h, params) => {
                        return h('div', params.row.Project.title)
                    }
                },
                {
                    title: '劳务公司',
                    key: 'LaborCorp.title',
                    render: (h, params) => {
                        return h('div', params.row.LaborCorp.title)
                    }
                },
                {
                    title: '劳务队',
                    key: 'LaborTeam.title',
                    render: (h, params) => {
                        return h('div', params.row.LaborTeam.title)
                    }
                },
                {
                    title: '状态',
                    key: 'status'
                },
                {
                    title: '生效日期',
                    key: 'effectiveDate',
                    render: (h, params) => {
                        return h('div', Vue.filter('datefmt')(params.row.effectiveDate))
                    }
                },
                {
                    title: '失效日期',
                    key: 'invaildDate',
                    render: (h, params) => {
                        return h('div', Vue.filter('datefmt')(params.row.invaildDate))
                    }
                },
                {
                    title: '添加时间',
                    key: 'createdAt',
                    render: (h, params) => {
                        return h('div', Vue.filter('timefmt')(params.row.createdAt))
                    }
                },
                {
                    title: '修改时间',
                    key: 'updatedAt',
                    render: (h, params) => {
                        return h('div', Vue.filter('timefmt')(params.row.updatedAt))
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 160,
                    render: (h, params) => {
                        if (this.loginUser.position === '') {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'warning',
                                        size: 'small',
                                        icon: 'ios-compose'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleEdit(params.row.id)
                                        }
                                    }
                                }, '修改')
                            ])
                        } else {
                            return h('div', '')
                        }
                    }
                }
            ]
        }
    },
    computed: {
        projectSelectVisible () {
            return this.loginUser.position !== '劳务公司经理'
        }
    },
    created () {
        if (this.projectSelectVisible) {
            this.getProjects()
        }
        this.getLaborCorps()
        this.handleQuery()
    },
    methods: {
        getProjects () { // 加载项目选择列表
            let condition = {status: '已审核'}
            if (this.loginUser.position === '建设单位主管') {
                condition = {...condition, buildCorpId: this.loginUser.corpId}
            } else if (this.loginUser.position === '项目经理') {
                condition = {...condition, constructCorpId: this.loginUser.corpId}
            } else {
                condition = {...condition}
            }
            query_project(condition).then(
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
        getLaborCorps () {
            let condition = { kind: '劳务公司', status: '已审核' }
            if (this.loginUser.position === '劳务公司经理') {
                condition = {...condition, id: this.loginUser.corpId}
            }
            query_corp(condition).then(
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
        getLaborTeams (laborCorpId = '') {
            if (laborCorpId === '') {
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
            this.getLaborTeams(value)
        },
        handleAdd () { // 处理添加按钮事件
            console.warn('handleAdd')
            this.tranData.visible = true
            this.tranData.edit = false
            this.tranData.id = ''
        },
        handleEdit (id) { // 处理编辑按钮事件
            console.warn(`handleEdit${id}`)
            this.tranData.visible = true
            this.tranData.edit = true
            this.tranData.id = id
        },
        handleQuery (current = 1) { // 处理查询按钮事件
            this.currentPage = current
            this.loading = true
            let condition = {projectId: this.filter.projectId, laborCorpId: this.filter.laborCorpId, laborTeamId: this.filter.laborTeamId}
            if (this.loginUser.position === '建设单位主管') {
                condition = {...condition, 'Project.buildCorpId': this.loginUser.corpId}
            } else if (this.loginUser.position === '项目经理') {
                condition = {...condition, 'Project.constructCorpId': this.loginUser.corpId}
            } else {
                condition = {...condition}
            }
            query_project_laborteam(condition).then(
                res => {
                    this.loading = false
                    this.total = res.count
                    this.datas = res.rows.map(
                        item => {
                            return {...item, status: checkTime(item.effectiveDate, item.invaildDate) ? '正常' : '失效'}
                        }
                    )
                }
            ).catch(
                err => {
                    this.loading = false
                    if (err.response.status === 400) {
                        this.$Message.error(err.response.data.message)
                    } else {
                        console.error(`err=${JSON.stringify(err)}`)
                    }
                }
            )
        },
        currentPageChange (value) { // 当前页改变事件
            console.warn(`currentPageChange value=${value} currentPage=${this.currentPage}`)
            this.handleQuery(value)
        }
    }
}
</script>
