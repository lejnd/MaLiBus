<template>
<div class='mobile-order bg-f5'>
    <topbar title="手机号下单"></topbar>
    <div class="header">
        <van-search
            v-model="mobile"
            placeholder="输入要辅助的手机号"
            show-action
            shape="round"
            left-icon="graphic"
        >
            <van-button class="btn" round slot="action" @click="addMobile" type="info" size="mini" :loading="isAddLoading">添加</van-button>
            <van-button class="btn" round plain slot="action" @click="replayHandler" type="info" size="mini" style="margin-left:5px;" :loading="isReplayLoading">刷新</van-button>
        </van-search>
        <van-cell title="手机号辅助省份" :value="user.tel_provcode_desc" is-link to="/settingProvince?type=2" />
        <div class="tip">
            步骤：手机号添加==》开始执行辅助==》平台告知辅助成功/失败==》1、若为辅助成功，才开始用这个手机号ZC；2、辅助失败，可重新用这个手机号重新添加执行（辅助成功后的30分钟内要ZC成功，否则辅助成功将失效）
        </div>
        <div class="container">
            <div class="nothing" v-if="nothing">
                <img src="../assets/img/nothing.png" alt="">
                <p>暂无记录</p>
            </div>
            <mobile-item
                v-for="(item, index) in items"
                :key="item.id"
                :item="item"
                :index="index"
                @replay="getList"
            ></mobile-item>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common'
import MobileItem from '@/components/mobile-item';
import { mapGetters, mapActions } from 'vuex';
import { setTimeout } from 'timers';
export default {
    name: 'MobileOrder',
    components: { Topbar, MobileItem },
    data() {
        return {
            mobile: '',
            items: [
                // {
                //     id: 1,
                //     mobile: 13111123342,
                //     status_des: '等待上传',
                //     time: '2019-10-24 10:33:22'
                // }, {
                //     id: 2,
                //     mobile: 13111120000,
                //     status_des: '辅助成功',
                //     time: '2019-10-24 10:34:22'
                // }
            ],
            nothing: false,
            isAddLoading: false,
            isReplayLoading: false,
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
        user() {
            return this.userInfo || {};
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo',
        ]),
        getList() {
            // const statusObj = {
            //     0: '等待上传',
            //     1: '辅助成功',
            //     6: '辅助失败',
            // }
            return this.$fly.get('/api/TelAssist/GetTaskList')
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    let list = data || [];
                    this.items = list.map(item => Object.assign({}, item, {
                        assist_Time: item.assist_Time ? common.formatTime(item.assist_Time) : '',
                        register_Time: item.register_Time ? common.formatTime(item.register_Time) : '',
                        // status_text: statusObj[item.status]
                    }));
                    this.nothing = this.items.length == 0
                } else {
                    this.nothing = true;
                    this.$toast(returnMsg)
                }
            })
        },
        replayHandler() {
            this.isReplayLoading = true;
            this.getList();
            let timer = setTimeout(() => {
                this.isReplayLoading = false;
            }, 3000)
        },
        addMobile() {
            if (!this.mobile) {
                this.$notify('请输入手机号码')
                return false
            }
            if (!common.isVerificationNumber(this.mobile)) {
                this.$notify('手机号码格式不正确')
                return false
            }
            this.isAddLoading = true;
            this.$fly.post(`/api/TelAssist/CreatePhoneOrder?phone=${this.mobile}`)
            .then((res) => {
                this.isAddLoading = false;
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$toast(returnMsg)
                    this.getList()
                } else {
                    this.$notify(returnMsg)
                }
            })
        }
    },
    mounted() {
        this.getUserInfo().then(() => {
            if (this.user.tel_provcode == -1) {
                this.$toast('请先设置手机号辅助省份')
                this.$router.push('/settingProvince?type=2')
            }
        })
        this.getList()
    },
}
</script>

<style lang='less'>
.mobile-order {
    .header {
        .btn {
            height: 32px;
            line-height: 28px;
        }
    }
    .tip {
        padding: 10px;
        font-size: 12/11rem;
        color: #808080;
    }
    .container {
        // margin-top: 8px;
        padding: 10px;
        // background-color: #fff;
        .nothing {
            text-align: center;
            padding: 40px 0;
            img {
                width: 100px;
                opacity: .4;
            }
            p {
                padding: 10px;
                font-size: 14/11rem;
                color: #999;
            }
        }
    }
}
</style>