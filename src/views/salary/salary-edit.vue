
<template>
    <Modal v-model="tranData.visible" title="修改工资" @on-ok="handleSave" @on-cancel="handleCancel" @on-visible-change="visibleChange" :loading="modal_loading">
        <Form ref="saveForm" :model="saveForm" :rules="ruleValidate" :label-width="80">
            <FormItem label="应出勤天数" prop="standardAttendDay">
                <InputNumber
                style="width:200px;"
                :max="31"
                v-model="saveForm.standardAttendDay"
                ></InputNumber>
                <span>天</span>
            </FormItem>
            <FormItem label="实出勤天数" prop="actualAttendDay">
                <InputNumber
                style="width:200px;"
                :max="31"
                v-model="saveForm.actualAttendDay"
                ></InputNumber>
                <span>天</span>
            </FormItem>
            <FormItem label="工资" prop="money">
                <InputNumber
                style="width:200px;"
                :max="1000000"
                v-model="saveForm.money"
                ></InputNumber>
                <span>元</span>
            </FormItem>
            <FormItem slot="footer">
                <Button type="text" @click="handleCancel">取消</Button>
                <Button type="primary" @click="handleSave">保存</Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import {save_salary, get_salary} from '@/api/salary.js'
export default {
    data () {
        return {
            saveForm: { // 保存的form对象
                standardAttendDay: 0,
                actualAttendDay: 0,
                money: 0
            },
            ruleValidate: { // 表单校验
                standardAttendDay: [
                    { required: true, type: 'number', message: '应出勤天数不能为空', trigger: 'change' }
                ],
                actualAttendDay: [
                    { required: true, type: 'number', message: '实出勤天数不能为空', trigger: 'change' }
                ],
                money: [
                    { required: true, type: 'number', message: '工资不能为空', trigger: 'change' }
                ]
            },
            modal_loading: true
        }
    },
    props: {
        tranData: {
            type: Object,
            default: () => {
                return {visible: false, id: ''}
            }
        }
    },
    methods: {
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
                            save_salary(this.saveForm).then(
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
                this.getObjectById()
            } else { // 当模态框关闭时,重置表单
                this.$refs['saveForm'].resetFields()
                this.saveForm = { key: '', value: '', desc: '' }
            }
        },
        getObjectById () { // 通过父组件传来的id,获取到该对象
            get_salary(this.tranData.id).then(
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
