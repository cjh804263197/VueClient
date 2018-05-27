<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="12">
                <span class="expand-key">项目地址: </span>
                <span class="expand-value">{{ row.addr }}</span>
            </Col>
            <Col span="12">
                <span class="expand-key">施工许可证号: </span>
                <span class="expand-value">{{ row.buildLicenceCerNum }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
                <span class="expand-key">建筑面积: </span>
                <span class="expand-value">{{ row.buildArea }}㎡</span>
            </Col>
            <Col span="12">
                <span class="expand-key">工程结构: </span>
                <span class="expand-value">{{ row.struct }}</span>
            </Col>
        </Row>
        <Row class="expand-row">
            <Col span="12">
                <span class="expand-key">工程造价: </span>
                <span class="expand-value">{{ row.cost }}元</span>
            </Col>
            <Col span="12">
                <span class="expand-key">合同金额: </span>
                <span class="expand-value">{{ row.contractAmount }}元</span>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
    props: {
        row: Object
    }
}
</script>
