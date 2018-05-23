<template>
    <div>
        <div class="demo-upload-list" v-for="(item, index) in previewList" :key="index">
            <template>
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon v-if="!item.upload" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
        </div>
        <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange" :id="'fileinput_'+id" class="fileinput" />
        <label v-show="selectVisible" class="filelabel" :for="'fileinput_'+id"><Icon type="camera"></Icon></label>
        <Modal title="查看图片" v-model="preview.visible">
            <img :src="preview.url" v-if="preview.visible" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                preview: {
                    visible: false,
                    url: ''
                },
                fileList: []
            }
        },
        props: {
            uploadedList: { // 已上传图片路径数组
                type: Array,
                default: () => {
                    return []
                }
            },
            max: { // 最多选择几张图片
                type: Number,
                default: 1
            },
            id: { // dom唯一表识,避免在同组件内多次引用该组件时造成除第一个引用该组件有值外，其余全部没有值
                type: String,
                required: true
            }
        },
        computed: {
            previewList () {
                let unuploads = this.fileList.map(item => {
                    return item.preview
                })
                let uploadeds = this.uploadedList.map(item => {
                    return {id: Math.random().toString().substr(2), url: item, upload: true}
                })
                return unuploads.concat(uploadeds)
            },
            selectVisible () {
                return this.max > this.previewList.length
            }
        },
        watch: {
            fileList (oldList, newList) { // 当fileList改变时触发
                this.$emit('file-list-change', this.fileList)
            }
        },
        methods: {
            handleChange (e) { // 选择图片
                let file = e.target.files[0]
                let reader = new FileReader()
                let vm = this
                reader.onloadend = function () {
                    // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
                    let dataURL = reader.result
                    // 生成一个唯一key用来作为删除的唯一标识
                    let keyID = Math.random().toString().substr(2)
                    vm.fileList.push({file, preview: {id: keyID, url: dataURL, upload: false}})
                    // vm.$emit('file-list-change', vm.fileList)
                }
                reader.readAsDataURL(file) // 读出 base64
            },
            handleRemove (item) { // 移除图片
                let index = this.fileList.indexOf(item)
                this.fileList.splice(index, 1)
                // this.$emit('file-list-change', this.fileList)
            },
            handleView (item) { // 查看图片
                this.preview.visible = true
                this.preview.url = item.url
            }
        }
    }
</script>
<style scoped lang="less">
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .fileinput{
        display: none;
    }
    .filelabel{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px dashed #d1d0d0;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
</style>
