
<template>
    <Modal v-model="tranData.visible" :title="title" @on-ok="handleSave" @on-cancel="handleCancel" @on-visible-change="visibleChange" :loading="modal_loading">
        <Form ref="saveForm" :model="saveForm" :rules="ruleValidate" :label-width="80">
            <FormItem label="所属企业" prop="corpId">
                <Select v-model="saveForm.corpId" placeholder="请选择所属企业" clearable>
                    <Option v-for="item in corpList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
            </FormItem>
            <FormItem label="姓名" prop="name">
                <Input v-model="saveForm.name" placeholder="请输入姓名"/>
            </FormItem>
            <FormItem label="用户名" prop="username">
                <Input v-model="saveForm.username" placeholder="请输入用户名"/>
            </FormItem>
            <FormItem label="密码" prop="password" v-if="!tranData.edit">
                <Input type="password" v-model="saveForm.password" placeholder="请输入密码"/>
            </FormItem>
            <FormItem label="职位" prop="position">
                <Input v-model="saveForm.position" placeholder="请输入职位"/>
            </FormItem>
            <FormItem slot="footer">
                <Button type="text" @click="handleCancel">取消</Button>
                <Button type="primary" @click="handleSave">保存</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import {save_user, get_user} from '../../api/corpUser.js'
import {query_corp} from '@/api/corp.js'
export default {
    data () {
        return {
            saveForm: { // 保存的form对象
                corpId: '',
                name: '',
                username: '',
                password: '',
                position: ''
            },
            corpList: [],
            ruleValidate: { // 表单校验
                corpId: [
                    { required: true, message: '所属企业不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                position: [
                    { required: true, message: '职位不能为空', trigger: 'blur' }
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
            this.saveForm.password = ''
            this.ruleValidate.password[0].required = false
            return this.tranData.edit ? `修改${this.tranData.title}` : `添加${this.tranData.title}`
        }
    },
    created () {
        this.getCorpList()
    },
    methods: {
        getCorpList () {
            query_corp({}).then(
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
                            save_user(this.saveForm).then(
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
                name: '',
                username: '',
                password: '',
                position: ''
            },
                console.warn('重置了')
            }
        },
        getObjectById () { // 通过父组件传来的id,获取到该对象
            get_user(this.tranData.id).then(
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
