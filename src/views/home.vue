<template>
<div class='home'>
    <home-top title="码力" handler-name="公告" @onClickRight="onClickRight">
        <van-icon name="volume" />
    </home-top>
    <div class="container">
        <div class="money-data">
            <div class="item">
                <h3 class="price" style="color:#0496ff;">¥ {{user.account_money}}</h3>
                <span class="detail">当前余额</span>
                <van-button class="btn" type="info" size="mini" @click="isDevRecharge">充值</van-button>
            </div>
            <div class="item">
                <h3 class="price" style="color:#ff00ff;">¥ {{user.hand_task_money}}</h3>
                <span class="detail">手动发布价</span>
                <van-button class="btn" type="info" size="mini" @click="openSettingDialog('手动发布价格')">设置</van-button>
            </div>
            <div class="item">
                <h3 class="price" style="color:#34cc03;">¥ {{user.task_money}}</h3>
                <span class="detail">api发布价</span>
                <van-button class="btn" type="info" size="mini" @click="openSettingDialog('api发布价格')">设置</van-button>
            </div>
        </div>
        <div class="region-wp">
            <div class="region-row">
                <h3>归属地</h3>
                <van-dropdown-menu class="flex1">
                    <van-dropdown-item v-model="region" :options="regionOpt" @change="regionChange" />
                </van-dropdown-menu>
            </div>
            <van-cell-group>
                <van-field
                    v-model="remark"
                    label="备注"
                    type="textarea"
                    placeholder="可输入手机号或字母，方便区分多个订单"
                    autosize
                />
            </van-cell-group>
        </div>
        <p class="tip">
            <span class="title">提示：</span>
            若下单价提高，有助于用户快速接单！（若拍照二维码识别失败，请上传截图二维码）。
        </p>
        <div class="handler-group">
            <van-grid :border="false" :column-num="3">
                <van-grid-item @click="gotoBarcode">
                    <img class="icon" src="../assets/img/qr-upload.jpg" />
                    <span class="name">扫码上传</span>
                </van-grid-item>
                <van-grid-item @click="openDialog">
                    <img class="icon" src="../assets/img/quick-order.png" />
                    <span class="name">快速接单</span>
                </van-grid-item>
                <van-grid-item @click="isDev">
                    <img class="icon" src="../assets/img/tel-upload.jpg" />
                    <span class="name">手机号上传</span>
                </van-grid-item>
            </van-grid>
        </div>
        <div class="panel">
            <p><strong>公告：</strong>{{notice || '暂无公告'}}</p>
        </div>
    </div>
    <van-dialog
        v-model="dialogShow"
        title="快速接单"
        show-cancel-button
        confirm-button-text="提交"
        cancel-button-text="返回"
        confirm-button-color="#ff3300"
        :before-close="quickTask"
    >
        <div class="dialog-content">
            <div class="user">
                <div class="avatar">
                    <img src="../assets/img/logo.jpeg" alt="">
                </div>
                <p class="text">账户：{{user.tel}}</p>
            </div>
            <p class="tip">
                <span class="title">提示：</span>
                我要加速，让单子更容易被辅助（0为不加速）。基础价格未设置，找客服设置。
            </p>
            <div class="form-wp">
                <van-grid :border="false" :column-num="3">
                    <van-grid-item>
                        <span class="value">¥ {{user.task_money}}</span>
                        <span class="title">基础价格</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">¥ {{user.speed_task_money}}</span>
                        <span class="title">加速价格</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">¥ {{user.task_money+user.speed_task_money}}</span>
                        <span class="title">下单价格</span>
                    </van-grid-item>
                </van-grid>
                <van-cell-group>
                    <van-field v-model="price" type="number" placeholder="输入加速价格">
                        <span slot="right-icon">元</span>
                    </van-field>
                </van-cell-group>
            </div>
        </div>
    </van-dialog>
    <van-dialog
        v-model="settingDialog"
        :title="`设置${dialogText}`"
        show-cancel-button
        @confirm="confirmSetting"
    >
        <div class="dialog-content">
            <p class="tip">
                <span class="title">提示：</span>
                输入价格最低6.6元，最高30元
            </p>
            <div class="form-wp">
                <van-cell-group>
                    <van-field v-model="price" type="number" :placeholder="`输入${dialogText}`">
                        <span slot="right-icon">元</span>
                    </van-field>
                </van-cell-group>
            </div>
        </div>
    </van-dialog>
    <tab-bar :active="0"></tab-bar>
</div>
</template>

<script>
import HomeTop from '@/components/home-top.vue';
import TabBar from '@/components/tab-bar.vue';
import { mapGetters, mapActions } from 'vuex';
import common from '../components/common';
import config from '../config';
import wx from 'weixin-js-sdk';

export default {
    name: 'Home',
    components: { TabBar, HomeTop },
    data() {
        return {
            remark: '',
            region: localStorage.getItem('region') || '0',
            regionOpt: config.regions,

            price: '',
            dialogShow: false,
            settingDialog: false,
            dialogText: '',
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'notice'
        ]),
        user() {
            return this.userInfo || {};
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo',
            'getNotice'
        ]),
        regionChange() {
            localStorage.setItem('region', this.region);
        },
        isDev() {
            this.$toast('该功能正在完善，敬请期待')
        },
        isDevRecharge() {
            this.$toast('充值走线下，请联系客服')
        },
        openDialog() {
            this.price = '';
            this.dialogShow = true;
        },
        openSettingDialog(name) {
            this.dialogText = name;
            this.price = '';
            this.settingDialog = true;
        },
        confirmSetting() {
            if (this.dialogText == '手动发布价格') {
                this.setTaskMonry(1)
            }
            if (this.dialogText == 'api发布价格') {
                this.setTaskMonry(0)
            }
        },
        quickTask(action, done) {
            if (action === 'confirm') {
                this.setTaskMonry(2).then(() => {
                    done(false);
                });
            } else {
                done();
            }
        },
        setTaskMonry(type) {
            if (this.price < 0) {
                this.$notify('输入金额不能小于0');
                return false;
            }
            if (type != 2) {
                if (this.price < 6.6) {
                    this.$notify('输入金额不能小于6.6');
                    return false;
                }
                if (this.price > 30) {
                    this.$notify('输入金额不能大于30');
                    return false;
                }
            }
            return this.$fly.post('/api/CompanyOption/SetTaskMoney', common.connectObj({
                taskMoney: this.price,
                dealType: type,
            })).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$toast(returnMsg);
                    this.getUserInfo();
                } else {
                    this.$notify(returnMsg);
                }
            })
        },
        onClickRight() {
            if (this.notice) {
                this.$dialog.alert({
                    title: '公告',
                    message: this.notice,
                    messageAlign: 'left',
                })
            } else {
                this.getNotice().then(() => {
                    this.$dialog.alert({
                        title: '公告',
                        message: this.notice || '暂无公告',
                        messageAlign: 'left',
                    })
                })
            }
        },
        gotoBarcode() {
            // if (this.region == '0') {
            //     this.$notify('请先选择归属地！');
            //     return false;
            // }
            if (window.plus) {
                this.$router.push(`/barcode?remark=${this.remark}`);
            } else {
                this.$dialog.alert({
                    title: '提示',
                    message: '该功能需要下载APP才能使用',
                    confirmButtonText: '去下载'
                }).then(() => {
                    this.$router.push('/user/download');
                });
            }
            // else if (common.isWeiXin()) {
            //     let vm = this;
            //     wx.scanQRCode({
            //         needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            //         scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
            //         success: function(res) {
            //             var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            //             vm.$dialog.alert({
            //                 title: '提示',
            //                 message: result
            //             })
            //         }
            //     });
            // }
        },
        getRegionList() {
            return this.$fly.get('/api/CompanyOption/GetProvince')
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.regionOpt = data.map(item => ({
                        text: item.province_name,
                        value: item.province_code,
                    }))
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
    },
    mounted() {
        this.getRegionList();
        this.getUserInfo();
    },
}
</script>

<style lang='less'>
.home {
    padding-bottom: 40px;
    .container {
        padding: 15px;
        .money-data {
            display: flex;
            justify-content: space-between;
            box-shadow: 0 0 8px #d2eeff;
            border-radius: 8px;
            padding: 5px;
            margin-bottom: 15px;
            .item {
                width: 32%;
                display: flex;
                flex-direction: column;
                align-items: center;
                border-radius: 8px;
                // box-shadow: 0 0 8px #d2eeff;
                padding: 15px 0;
                .price {
                    font-size: 15/11rem;
                    font-weight: 700;
                }
                .detail {
                    padding: 5px 0 10px 0;
                }
            }
        }
        .region-wp {
            box-shadow: 0 0 8px #d2eeff;
            border-radius: 8px;
            margin-bottom: 15px;
            .region-row {
                padding: 0 15px;
                display: flex;
                align-items: center;
                font-size: 14/11rem;
                .flex1 {
                    flex: 1;
                    .van-dropdown-menu__title {
                        width: 90%;
                        text-align: center;
                    }
                }
            }
        }
        .tip {
            font-size: 12/11rem;
            padding: 5px 0 15px 0;
            color: #888;
            .title {
                color: #f40;
            }
        }
        .handler-group {
            box-shadow: 0 0 8px #d2eeff;
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
            .icon {
                width: 4.5rem;
                padding: 10px 0;
            }
            .name {
                padding: 10px 0;
            }
        }
        .panel {
            padding-top: 5px;
            p {
                color: #787878;
                line-height: 1.6;
                strong {
                    font-weight: 700;
                    color: #333;
                }
            }
        }
    }
    .dialog-content {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .user {
            padding: 20px;
            background: linear-gradient(left, #ff9924, #fe5300);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .avatar {
                width: 5rem;
                height: 5rem;
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: 100%;
                }
            }
            .text {
                color: #fff;
                padding-top: 10px;
            }
        }
        .tip {
            font-size: 12/11rem;
            padding: 15px 10px;
            color: #888;
            .title {
                color: #f40;
            }
        }
        .form-wp {
            padding: 15px 0;
            box-shadow: 0 0 8px #eee;
            border-radius: 8px;
            width: 100%;
            .value {
                font-size: 15/11rem;
                font-weight: 700;
                color: #ff7702;
            }
            .title {
                font-size: 12/11rem;
                padding: 10px 0;
            }
            .van-cell {
                background-color: #eee;
            }
        }
    }
}
</style>