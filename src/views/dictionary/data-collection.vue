
<template>
    <Modal v-model="tranData.visible" :title="title" @on-ok="handleSave" @on-cancel="handleCancel" @on-visible-change="visibleChange" :loading="modal_loading">
        <Form ref="saveForm" :model="saveForm" :rules="ruleValidate" :label-width="80">
            <FormItem label="类别" prop="key">
                <Input v-model="saveForm.key" placeholder="请输入类别"/>
            </FormItem>
            <FormItem label="值" prop="value">
                <Input v-model="saveForm.value" placeholder="请输入值"/>
            </FormItem>
            <FormItem label="描述" prop="desc">
                <Input v-model="saveForm.desc" placeholder="请输入描述"/>
            </FormItem>
            <FormItem slot="footer">
                <Button type="text" @click="handleCancel">取消</Button>
                <Button type="primary" @click="handleSave">保存</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import {save_dic, get_dic} from '../../api/dictionary.js'
export default {
    data () {
        return {
            saveForm: { // 保存的form对象
                key: '',
                value: '',
                desc: ''
            },
            ruleValidate: { // 表单校验
                key: [
                    { required: true, message: '类别不能为空', trigger: 'blur' }
                ],
                value: [
                    { required: true, message: '值不能为空', trigger: 'blur' }
                ],
                desc: [
                    { required: true, message: '描述不能为空', trigger: 'blur' }
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
    methods: {
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
                            save_dic(this.saveForm).then(
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
                this.saveForm = { key: '', value: '', desc: '' }
                console.warn('重置了')
            }
        },
        getObjectById () { // 通过父组件传来的id,获取到该对象
            get_dic(this.tranData.id).then(
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
