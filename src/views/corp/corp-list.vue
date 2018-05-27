<template>
    <div>
        <Row class="margin-top-20">
            <!-- 查询面板 -->
            <Form ref="formInline" :model="filter" inline>
                <FormItem prop="title">
                    <Input type="text" v-model="filter.title" icon="search" clearable placeholder="通过企业名称检索"/>
                </FormItem>
                <FormItem prop="kind">
                    <Select v-model="filter.kind" placeholder="企业类型筛选" clearable style="width: 150px;">
                        <Option v-for="item in corpKinds" :value="item.value" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="aptitude">
                    <Select v-model="filter.aptitude" placeholder="资质类型筛选" clearable>
                        <Option v-for="item in aptitudeKinds" :value="item.value" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="status">
                    <Select v-model="filter.status" placeholder="企业状态筛选" clearable>
                        <Option v-for="item in corpStatus" :value="item.value" :key="item.value">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" icon="ios-search-strong" @click="handleQuery()">查询</Button>
                    <Button type="success" icon="ios-plus" @click="handleAdd()">添加</Button>
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
import { query_corp, destory_corp, save_corp } from '@/api/corp.js'
import { query_dic } from '@/api/dictionary.js'
import Vue from 'vue'
import expandRow from './components/table-expand'
export default {
    components: {
        expandRow
    },
    data () {
        return {
            loading: false,
            filter: { // 查询条件
                title: '', // 企业名称
                status: '', // 企业状态
                kind: '', // 企业类型
                aptitude: '' // 资质类型
            },
            corpKinds: [],
            aptitudeKinds: [],
            corpStatus:[],
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
                    title: '企业名称',
                    key: 'title'
                },
                {
                    title: '企业类型',
                    key: 'kind'
                },
                {
                    title: '企业状态',
                    key: 'status'
                },
                {
                    title: '资质类型',
                    key: 'aptitudeKind'
                },
                {
                    title: '批准日期',
                    key: 'approveDate',
                    render: (h, params) => {
                        return h('div', Vue.filter('datefmt')(params.row.approveDate))
                    }
                },
                {
                    title: '生效日期',
                    key: 'effectiveDate',
                    render: (h, params) => {
                        return h('div', Vue.filter('datefmt')(params.row.effectiveDate))
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
                        if (params.row.status === '未审核') { // 若为已审核状态，则只提供修改按钮
                            return h('div', [
                                h('Button', {
                                    props: {
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
                                }, '审核'),
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
                        } else {
                            return h('div')
                        }
                        
                    }
                }
            ]
        }
    },
    created () { // 生命周期create钩子函数
        // 加载企业类型选择条件
        query_dic({key: 'CorpKind'}).then(
            res => {
                this.corpKinds = res.rows
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
        query_dic({key: 'AptitudeKind'}).then(
            res => {
                this.aptitudeKinds = res.rows
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
        query_dic({key: 'CorpStatus'}).then(
            res => {
                this.corpStatus = res.rows
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
        handleAdd () { // 处理添加按钮事件
            this.$router.push({
                name: 'corp-add'
            })
        },
        handleAudit (id) { // 处理审核按钮事件
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要审核该条企业信息吗？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    save_corp({id, status: '已审核'}).then(
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
                name: 'corp-add',
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
                    destory_corp(id).then(
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
        handleQuery (current = 1) { // 处理查询按钮事件
            this.currentPage = current
            this.loading = true
            query_corp({'like%title': this.filter.title, kind: this.filter.kind, status: this.filter.status, aptitudeKind: this.filter.aptitude, limit: this.limit, currentPage: this.currentPage}).then(
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
