<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="12">
                <span class="expand-key">注册地址: </span>
                <span class="expand-value">{{ row.registerAddr }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">办公地址: </span>
                <span class="expand-value">{{ row.officeAddr }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
                <span class="expand-key">企业法人: </span>
                <span class="expand-value">{{ row.corporater }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">法人电话: </span>
                <span class="expand-value">{{ row.corporateTel }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
                <span class="expand-key">企业联系人: </span>
                <span class="expand-value">{{ row.contactor }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">联系人电话: </span>
                <span class="expand-value">{{ row.contactTel }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
                <span class="expand-key">企业邮箱: </span>
                <span class="expand-value">{{ row.email }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">营业执照号: </span>
                <span class="expand-value">{{ row.businessLicenceNum }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
                <span class="expand-key">资质证号: </span>
                <span class="expand-value">{{ row.aptitudeCerNum }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">安全许可证号: </span>
                <span class="expand-value">{{ row.safetyCerNum }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="4">
                <span class="expand-key">营业执照: </span>
            </Col>
            <Col span="20">
                <img :src="businessLicenceImg"/>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="4">
                <span class="expand-key">资质证: </span>
            </Col>
            <Col span="20">
                <img :src="aptitudeCerImg"/>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="4">
                <span class="expand-key">安全许可证: </span>
            </Col>
            <Col span="20"> 
                <img :src="safetyCerImg"/>
            </Col>
        </Row>
    </div>
</template>
<script>
import baseUrl from '@/api/url.js'
export default {
    props: {
        row: Object
    },
    computed: {
        businessLicenceImg () {
            return baseUrl+this.row.businessLicenceImg
        },
        aptitudeCerImg () {
            return baseUrl+this.row.aptitudeCerImg
        },
        safetyCerImg () {
            return baseUrl+this.row.safetyCerImg
        }
    }
}
</script>
