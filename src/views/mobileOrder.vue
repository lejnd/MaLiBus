<template>
<div class='mobile-order bg-f5'>
    <topbar title="手机号下单"></topbar>
    <div class="header">
        <van-cell-group>
            <van-field v-model="mobile" placeholder="输入要辅助的手机号" />
        </van-cell-group>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'

export default {
    name: 'MobileOrder',
    components: {},
    data() {
        return {
            mobile: '',
        };
    },
    methods: {
        
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.mobile-order {
    .container {

    }
}
</style>