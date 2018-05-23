<template>
    <div>
        <Row class="margin-top-20">
            <!-- 查询面板 -->
            <Form ref="formInline" :model="filter" inline>
                <FormItem prop="key">
                    <Input type="text" v-model="filter.key" icon="search" placeholder="通过Key检索"/>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleQuery()">查询</Button>
                    <Button type="success" @click="handleAdd()">添加</Button>
                </FormItem>
            </Form>
        </Row>
        <Row class="searchable-table-con1">
            <!-- 一个带斑马纹和加载状态的Table -->
            <Table stripe :loading="loading" :columns="columns" :data="datas"></Table>
            <!-- 分页控件 -->
            <Page style="float: right;" :transfer="true" :current.sync="currentPage" :page-size="limit" :total="total" @on-change="currentPageChange" show-total></Page>
        </Row>
        <data-collection :tranData="tranData" @success="handleQuery"></data-collection>
    </div>
</template>

<script>
import {destory_dic, query_dic} from '@/api/dictionary.js'
import dataCollection from './data-collection'
export default {
    components: {
        dataCollection
    },
    data () {
        return {
            filter: { // 搜索条件
                key: ''
            },
            loading: false, // table的加载状态 默认为false
            columns: [ // Table title
                {
                    title: '类别',
                    key: 'key'
                },
                {
                    title: '值',
                    key: 'value'
                },
                {
                    title: '备注',
                    key: 'desc'
                },
                {
                    title: '添加时间',
                    key: 'createdAt',
                    render: (h, params) => {
                        return h('div', params.row.createdAt)
                    }
                },
                {
                    title: '修改时间',
                    key: 'updatedAt',
                    render: (h, params) => {
                        return h('div', params.row.updatedAt)
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    width: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
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
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.handleDelete(params.row.id)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            datas: [], //存放查询结果数据
            total: 0, // 查询总记录数
            currentPage: 1, // 当前页
            limit: 10, // 页大小
            tranData: { // 向编辑数据模态框传值
                visible: false, 
                edit: false, 
                title: '数据字典', 
                id: ''
            }
        }
    },
    created () {
        this.handleQuery()
    },
    methods: {
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
        handleDelete (id) { // 处理删除按钮事件
            console.warn(`handleDelete${id}`)
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要删除该条记录吗？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    destory_dic(id).then(
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
            query_dic({'like%key': this.filter.key, limit: this.limit, currentPage: this.currentPage}).then(
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

