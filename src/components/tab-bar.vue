<template>
<div class='tab-bar'>
    <van-tabbar v-model="thisActive">
        <van-tabbar-item to="/">
            <span>首页</span>
            <span slot="icon" class="icon-home" style="font-size:17px;"></span>
        </van-tabbar-item>
        <van-tabbar-item icon="balance-list" to="/bill">账单</van-tabbar-item>
        <van-tabbar-item icon="manager" to="/user">我的</van-tabbar-item>
    </van-tabbar>
</div>
</template>

<script>

export default {
    name: 'TabBar',
    props: {
        active: {
            type: Number,
            default: () => 0,
        }
    },
    data() {
        return {
            thisActive: this.active,
        };
    },
    methods: {
        
    },
    mounted() {
        this.thisActive = this.active;
    },
}
</script>

<style lang='less'>
    .tab-bar {
        height: 56px;
        .van-tabbar-item--active {
            color: #fe6a03;
        }
        .van-tabbar {
            height: 53px;
        }
        .van-tabbar-item__icon .van-icon {
            font-size: 20px;
        }
    }
</style>