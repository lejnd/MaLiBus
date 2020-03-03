<template>
<div class='mobile-order bg-f5'>
    <topbar title="手机号下单">
        <van-button
            class="top-btn"
            round plain
            slot="right"
            @click="replayHandler"
            type="info" size="mini"
            style="margin-left:5px;"
            :loading="isReplayLoading"
            icon="replay"
        >刷新</van-button>
    </topbar>
    <div class="header">
        <div class="region-row">
            <h3>选择区号：</h3>
            <van-dropdown-menu class="flex1">
                <van-dropdown-item v-model="areaText" :options="areaOpt" @change="changeArea"/>
            </van-dropdown-menu>
        </div>
        <van-search
            v-model="mobile"
            placeholder="输入要辅助的手机号"
            show-action
            shape="round"
            left-icon="graphic"
        >
            <van-button class="btn" round slot="action" @click="addMobile" type="info" size="mini" :loading="isAddLoading">添加</van-button>
            <van-button class="btn" round plain slot="action" @click="batchDialog=true" type="primary" size="mini">批量</van-button>
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
    <van-dialog
        v-model="batchDialog"
        title="批量添加手机号"
        show-cancel-button
        confirm-button-text="批量添加"
        :before-close="beforeCloseAdd"
    >
        <div class="dialog-content">
            <p class="tip">注意：多个手机号使用逗号分隔，只能输入数字和逗号</p>
            <van-cell-group>
                <van-field class="input-bg" v-model="batchMobile" type="textarea" rows="4" clearable autosize placeholder="请输入手机号，使用逗号分隔" />
            </van-cell-group>
            <p class="error" v-html="errMsg"></p>
        </div>
    </van-dialog>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common';
import config from '@/config'
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
            batchDialog: false,
            batchMobile: '',
            errMsg: '',

            areaOpt: config.areaCode,
            areaText: '中国大陆',
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
        user() {
            return this.userInfo || {};
        },
        area() {
            return this.areaOpt.find(item => item.value == this.areaText).code;
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
            if (!common.isNumber(this.mobile)) {
                this.$notify('手机号只能为数字')
                return false
            }
            this.isAddLoading = true;
            this.$fly.post(`/api/TelAssist/CreatePhoneOrder?phone=${this.mobile}&area=${this.area}`)
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
        },
        formatMobiles(str) {
            let strA = str.replace(/[^0-9,，]*/g,"");     // format as ',,1322333,23213312313，123233，23123233，2313,123'
            let strB = strA.replace(/，/g,",");     // format as '1322333,23213312313,123233,23123233,2313,123'
            let arr = strB.split(',');
            console.log('arr1：', arr);
            arr = arr.filter(d => d);
            console.log('arr2：', arr);
            arr = Array.from(new Set(arr));
            console.log('arr3：', arr);
            return arr
        },
        validateMobiles(arr) {
            return arr.filter(val => !common.isNumber(val));
        },
        beforeCloseAdd(action, done) {
            this.errMsg = '';
            if (action === 'confirm') {
                if (!this.batchMobile) {
                    this.$notify('请输入手机号');
                    done(false);
                    return false;
                }
                let mobileArr = this.formatMobiles(this.batchMobile);
                if (this.validateMobiles(mobileArr).length > 0) {
                    this.errMsg = '错误手机号：' + this.validateMobiles(mobileArr).join('，') + '<br>错误原因：1、手机号只能为数字；2、未使用逗号分割';
                    done(false);
                    return false;
                }
                this.$fly.post(`/api/TelAssist/CreateBatchOrder`, {
                    area: this.area,
                    phones: mobileArr
                }).then((res) => {
                    let { returnCode, returnMsg, data } = res;
                    if (returnCode == 100) {
                        this.$toast(returnMsg)
                        this.getList()
                        done();
                    } else {
                        this.$notify(returnMsg)
                        done(false);
                    }
                })
            } else {
                done();
            }
        },
        changeArea() {
            localStorage.setItem('areaText', this.areaText);
        }
    },
    mounted() {
        this.areaText = localStorage.getItem('areaText') || '中国大陆';
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
    .top-bar .van-nav-bar .van-icon {
        vertical-align: unset;
        padding: 0;
    }
    .top-btn {
        height: 32px;
        line-height: 28px;
        border: 0;
        font-size: 13/11rem;
        // display: flex;
        // align-items: center;
    }
    .header {
        .btn {
            height: 32px;
            line-height: 28px;
        }
        .region-row {
            padding: 0 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14/11rem;
            border-bottom: 1px solid #f5f5f5;
            background-color: #fff;
            .flex1 {
                flex: 1;
                .van-dropdown-menu__title {
                    width: 90%;
                    text-align: center;
                }
            }
            .radio-wp {
                flex: 1;
                display: flex;
                height: 60px;
                .van-radio {
                    margin-left: 15/11rem;
                }
            }
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
    .van-dialog {
        max-width: 600px;
    }
    .dialog-content {
        padding: 15px 0;
        .tip {
            padding: 10px 15px;
        }
        .input-bg {
            background-color: #f5f5f5;
        }
        .error {
            color: #f00;
            padding: 10px 15px;
            font-size: 12/11rem;
            word-break: break-all;
        }
    }
}
</style>