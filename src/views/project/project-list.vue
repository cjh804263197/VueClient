<template>
    <div>
        <Row class="margin-top-20">
            <!-- 查询面板 -->
            <Form ref="formInline" :model="filter" inline>
                <FormItem prop="title">
                    <Input type="text" v-model="filter.title" icon="search" clearable placeholder="通过项目名称检索"/>
                </FormItem>
                <FormItem prop="buildCorp">
                    <Select v-model="filter.buildCorpId" :clearable="buildCorpClearable" placeholder="建设单位筛选">
                        <Option v-for="item in buildCorps" :value="item.id" :disabled="buildCorpId !== '' && item.id !== buildCorpId" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="constructCorp">
                    <Select v-model="filter.constructCorpId" :clearable="constructCorpClearable" placeholder="施工总承包单位筛选">
                        <Option v-for="item in constructCorps" :value="item.id" :disabled="constructCorpId !== '' && item.id !== constructCorpId" :key="item.id">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="status">
                    <Select v-model="filter.status" placeholder="项目状态筛选" clearable>
                        <Option v-for="item in projectStatus" :value="item.value" :key="item.value">{{ item.value }}</Option>
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
import { query_corp } from '@/api/corp.js'
import { save_project, destory_project, query_project } from '@/api/project.js'
import { query_dic } from '@/api/dictionary.js'
import Vue from 'vue'
import expandRow from './components/table-expand'
import Cookies from 'js-cookie'
export default {
    components: {
        expandRow
    },
    data () {
        return {
            loginUser: JSON.parse(Cookies.get('user')),
            loading: false,
            filter: { // 查询条件
                title: '', // 项目名称
                buildCorpId: JSON.parse(Cookies.get('user')).position === '建设单位主管' ? JSON.parse(Cookies.get('user')).corpId : '', // 建设单位
                constructCorpId: JSON.parse(Cookies.get('user')).position === '项目经理' ? JSON.parse(Cookies.get('user')).corpId : '', // 施工总承包单位
                status: '' // 项目状态
            },
            buildCorps: [],
            constructCorps: [],
            projectStatus:[],
            datas: [], //存放查询结果数据
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
        buildCorpId () {
            return JSON.parse(Cookies.get('user')).position === '建设单位主管' ? JSON.parse(Cookies.get('user')).corpId : ''
        },
        constructCorpId () {
            return JSON.parse(Cookies.get('user')).position === '项目经理' ? JSON.parse(Cookies.get('user')).corpId : ''
        },
        buildCorpClearable () {
            return this.buildCorpId === ''
        },
        constructCorpClearable () {
            return this.constructCorpId === ''
        }
    },
    created () { // 生命周期create钩子函数
        // 加载项目状态选择条件
        query_dic({key: 'CorpStatus'}).then(
            res => {
                this.projectStatus = res.rows
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
        // 加载资质类型选择条件
        query_corp({kind: '建设单位', status: '已审核'}).then(
            res => {
                this.buildCorps = res.rows
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
        // 加载企业状态选择条件
        query_corp({kind: '施工总承包单位', status: '已审核'}).then(
            res => {
                this.constructCorps = res.rows
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

        this.handleQuery()
    },
    methods: {
        handleAudit (id) { // 处理审核按钮事件
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要审核该条项目信息吗？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    save_project({id, status: '已审核'}).then(
                        res => {
                            this.$Message.success('审核成功')
                            this.handleQuery()
                        }
                    ).catch(
                        err => {
                            if (err.response.status === 400) {
                                this.$Message.error('审核失败， 原因：' + err.response.data.message)
                            } else {
                                this.$Message.error('审核失败')
                                console.error(`err=${JSON.stringify(err)}`)
                            }
                        }
                    )
                }
            })
        },
        handleEdit (id) { // 处理编辑按钮事件
            console.warn(`handleEdit${id}`)
            this.$router.push({
                name: 'project-add',
                params: {id}
            })
        },
        handleDelete (id) { // 处理删除按钮事件
            console.warn(`handleDelete${id}`)
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要删除该条记录吗？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    destory_project(id).then(
                        res => {
                            this.$Message.success('删除成功')
                            this.handleQuery()
                        }
                    ).catch(
                        error => {
                            this.$Message.error('删除失败')
                        }
                    )
                }
            })
        },
        handleLaborTeamRela (id) { // 查看劳务关系
            console.warn(`handleLaborTeamRela${id}`)
        },
        handleQuery (current = 1) { // 处理查询按钮事件
            this.currentPage = current
            this.loading = true
            query_project({'like%title': this.filter.title, buildCorpId: this.filter.buildCorpId, constructCorpId: this.filter.constructCorpId, status: this.filter.status, limit: this.limit, currentPage: this.currentPage}).then(
                res => {
                    this.loading = false
                    this.total = res.count
                    this.datas = res.rows
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

<style lang="less">
    @import '../../styles/common.less';
    @import '../../styles/table.less';
</style>
