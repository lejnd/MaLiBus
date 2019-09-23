<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    data () {
        return {
            isShow: false,
        }
    },
    methods: {
        ...mapActions([
            'setNoticeId',
            'getUserInfo',
            'getNotice',
        ]),
    },
    created () {
        this.getUserInfo()
    },
    mounted () {
        // 公告alert
        this.getNotice().then((res) => {
            if (!res) return false;
            this.setNoticeId(res.id);
            if (res.is_show && !localStorage.getItem(`notice_${res.id}`)) {
                this.$dialog.confirm({
                    title: '公告',
                    message: res.content,
                    messageAlign: 'left',
                    cancelButtonText: '不再显示'
                }).then(() => {

                }).catch(() => {
                    localStorage.setItem(`notice_${res.id}`, 1)
                }); 
            }          
        })
    }
}
</script>


<style lang="less">
#app {
    @orange1: #fe5701;
    // @orange2: #fe5701;
    color: #333;
    font-size: 13/11rem;
    background-color: #fff;
    min-height: 100vh;
    .van-button--info {
        background-color: @orange1;
        border-color: @orange1;
    }
    .van-button--plain.van-button--info {
        background-color: #fff;
        color: @orange1;
    }

    // .blueStyle {
    //     .van-tabs__nav {
    //         background-color: @my_blue;
    //     }
    //     .van-tab {
    //         opacity: .6;
    //         color: #fff;
    //     }
    //     .van-tab--active {
    //         opacity: 1;
    //     }
    //     .van-tabs__line {
    //         background-color: #ffd270;
    //     }
    // }

    .bg-f5 {
        min-height: 100vh;
        background-color: #f5f5f5;
        padding-bottom: 40px;
    }
}
</style>