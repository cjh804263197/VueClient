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
                    <Select v-model="filter.laborCorpId" :clearable="laborCorpClearable" @on-change="laborCorpChange" placeholder="劳务公司筛选" style="width: 200px;">
                        <Option v-for="item in laborCorps" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="laborTeam">
                    <Select v-model="filter.laborTeamId" placeholder="劳务队筛选" clearable style="width: 200px;">
                        <Option v-for="item in laborTeams" :value="item.id" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="status">
                    <Select v-model="filter.status" placeholder="工资状态筛选" clearable style="width: 120px;">
                        <Option v-for="item in salaryStatus" :value="item.value" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="ios-search-strong" @click="handleQuery()">查询</Button>
                </FormItem>
            </Form>
        </Row>

        <Row class="searchable-table-con1">
            <!-- 一个带斑马纹和加载状态的Table -->
            <Table stripe :loading="loading" :columns="columns" :data="datas"></Table>
            <!-- 分页控件 -->
            <Page style="float: right;" :transfer="true" :current.sync="currentPage" :page-size="limit" :total="total" @on-change="currentPageChange" show-total></Page>
        </Row>
        
    </div>
</template>

<script>
import { query_project_laborteam } from '@/api/project.js'
import { query_laborteam } from '@/api/laborteam.js'
import { query_corp } from '../../api/corp.js'
import Vue from 'vue'
import Cookies from 'js-cookie'
export default {
    data () {
        return {
            loginUser: JSON.parse(Cookies.get('user')),
            filter: {
                yearAndMonth: '',
                projectId: '',
                laborCorpId: JSON.parse(Cookies.get('user')).position === '劳务公司经理' || JSON.parse(Cookies.get('user')).position === '劳资员' ? JSON.parse(Cookies.get('user')).corpId : '' ,
                laborTeamId: '',
                status: ''
            },
            projects: [],
            laborCorps: [],
            laborTeams: [],
            salaryStatus: [],
            datas: [], // 存放查询结果数据
            total: 0, // 查询总记录数
            currentPage: 1, // 当前页
            limit: 10, // 页大小
            columns: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    title: '项目名称',
                    key: 'title'
                },
                {
                    title: '建设单位',
                    key: 'BuildCorp',
                    render: (h, params) => {
                        return h('div', params.row.BuildCorps.title)
                    }
                },
                {
                    title: '施工总承包单位',
                    key: 'ConstructCorp',
                    render: (h, params) => {
                        return h('div', params.row.ConstructCorps.title)
                    }
                },
                {
                    title: '项目状态',
                    key: 'status'
                },
                {
                    title: '开工日期',
                    key: 'startDate',
                    render: (h, params) => {
                        return h('div', Vue.filter('datefmt')(params.row.startDate))
                    }
                },
                {
                    title: '竣工日期',
                    key: 'completeDate',
                    render: (h, params) => {
                        return h('div', Vue.filter('datefmt')(params.row.completeDate))
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
                    width: 220,
                    render: (h, params) => {
                        if (params.row.status === '未审核') { // 若为未审核状态
                            if (this.loginUser.position === '监管人员') { // 监管人员可以审核
                                return h('Button', { props: {
                                    type: 'info',
                                    size: 'small',
                                    icon: 'ios-checkmark'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.handleAudit(params.row.id)
                                    }
                                }
                                }, '审核')
                            } else if (this.loginUser.position === '建设单位主管') { // 建设单位主管可以进行修改及删除
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
                                    }, '修改'),
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small',
                                            icon: 'ios-trash'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleDelete(params.row.id)
                                            }
                                        }
                                    }, '删除')
                                ])
                            } else { // 其他人员什么都不能做
                                return h('div')
                            }
                        } else { // 若状态为已审核
                            if (this.loginUser.position === '建设单位主管' || this.loginUser.position === '项目经理') {
                                return h('Button', { props: {
                                    type: 'info',
                                    size: 'small',
                                    icon: 'ios-checkmark'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.handleLaborTeamRela(params.row.id)
                                    }
                                }
                                }, '劳务关系')
                            } else { // 其他人员什么都不能做
                                return h('div')
                            }
                        }
                        
                    }
                }
            ]
        }
    },
    computed: {
        laborCorpClearable () {
            return this.loginUser.position === '监管人员'
        }
    },
    created () {
        // 加载各查询条件的数据源
        this.getProjects()
        this.getLaborCorps()
        this.getLaborTeams()
        this.getSalaryStatus()
    },
    methods: {
        getProjects () { // 获取可选项目的数组
            let param = {}
            if (this.loginUser.position === '劳务公司经理' || this.loginUser.position === '劳资员') {
                param = {...param, laborCorpId: this.loginUser.corpId}
            }
            query_project_laborteam(param).then(
                res => {
                    let pros = res.rows.map(item => {
                        return item.Project
                    })
                    this.projects = []
                    // 去重算法
                    pros.forEach(pro => {
                        // 在每次push之前先判断this.projects中是都存在相同id的对象,若存在则不放入，反之则放入
                        let haveRepeat = this.projects.some(item => {
                            return item.id === pro.id
                        })

                        if (!haveRepeat) { this.projects.push(pro) }
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
        getLaborCorps () { // 获取可选劳务公司的数组
            let param = { status: '已审核', kind: '劳务公司' }
            if (this.loginUser.position === '劳务公司经理' || this.loginUser.position === '劳资员') {
                param = {...param, id: this.loginUser.corpId}
            }
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
        getLaborTeams (laborCorpId = this.filter.laborTeamId) {
            query_laborteam({corpId: laborCorpId}).then(
                this.laborTeams = res.rows
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
        getSalaryStatus () {
            query_dic({key: 'SalaryStatus'}).then(
                res => {
                    this.salaryStatus = res.rows
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
        yearMonthChange (value) {
            this.filter.yearAndMonth = value
        },
        laborCorpChange (value) {
            this.getLaborTeams(value)
        },
        handleQuery () {

        }
    }
}
</script>
