
<template>
    <Modal v-model="tranData.visible" :title="title" @on-ok="handleSave" @on-cancel="handleCancel" @on-visible-change="visibleChange" :loading="modal_loading">
        <Form ref="saveForm" :model="saveForm" :rules="ruleValidate" :label-width="80">
            <FormItem label="所属劳务公司" prop="corpId">
                <Select v-model="saveForm.corpId" placeholder="请选择所属劳务公司" clearable>
                    <Option v-for="item in corpList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
            </FormItem>
            <FormItem label="劳务队" prop="title">
                <Input v-model="saveForm.title" placeholder="请输入劳务队名称"/>
            </FormItem>
            <FormItem label="劳务队长" prop="leader">
                <Input v-model="saveForm.leader" placeholder="请输入劳务队长姓名"/>
            </FormItem>
            <FormItem label="联系电话" prop="leaderTel">
                <Input v-model="saveForm.leaderTel" placeholder="请输入联系电话"/>
            </FormItem>
            <FormItem slot="footer">
                <Button type="text" @click="handleCancel">取消</Button>
                <Button type="primary" @click="handleSave">保存</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import {save_laborteam, get_laborteam} from '../../api/laborteam.js'
import {query_corp} from '@/api/corp.js'
import Vue from 'vue'
import Cookies from 'js-cookie'
export default {
    data () {
        return {
            loginUser: JSON.parse(Cookies.get('user')),
            saveForm: { // 保存的form对象
                corpId: JSON.parse(Cookies.get('user')).corpId,
                title: '',
                leader: '',
                leaderTel: ''
            },
            corpList: [],
            ruleValidate: { // 表单校验
                corpId: [
                    { required: true, message: '所属劳务公司不能为空', trigger: 'change' }
                ],
                title: [
                    { required: true, message: '劳务队名字不能为空', trigger: 'blur' }
                ],
                leader: [
                    { required: true, message: '劳务队长不能为空', trigger: 'blur' }
                ],
                leaderTel: [
                    { required: true, message: '联系电话不能为空', trigger: 'blur' }
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
        this.getCorpList()
    },
    methods: {
        getCorpList () {
            query_corp({status: '已审核', kind: '劳务公司', id: this.loginUser.corpId}).then(
                res => {
                    this.corpList = res.rows
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
        handleSave () {
            console.warn('save')
            this.$refs['saveForm'].validate((valid) => {
                if (valid) {
                    console.warn('验证通过')
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定要保存该条记录吗？</p>',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            save_laborteam(this.saveForm).then(
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
                if (this.tranData.edit) { // 当父组件传来编辑是true时，表明将要修改，则需获取到该编辑对象
                    this.getObjectById()
                }
            } else { // 当模态框关闭时,重置表单
                this.$refs['saveForm'].resetFields()
                this.saveForm = { 
                corpId: '',
                title: '',
                leader: '',
                leaderTel: ''
            },
                console.warn('重置了')
            }
        },
        getObjectById () { // 通过父组件传来的id,获取到该对象
            get_laborteam(this.tranData.id).then(
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
