<template>
<div class='user-recharge bg-f5'>
    <topbar title="充值中心"></topbar>
    <div class="container">
        <div class="handler-group">
            <van-grid :border="false" :column-num="2">
                <van-grid-item @click="openDialog(0)">
                    <img class="icon" src="../assets/img/recharge1.jpeg" />
                    <span class="name">银行卡充值</span>
                </van-grid-item>
                <van-grid-item @click="openDialog(1)">
                    <img class="icon" src="../assets/img/recharge2.jpeg" />
                    <span class="name">支付宝充值</span>
                </van-grid-item>
            </van-grid>
        </div>
        <div class="detail">
            <h3>充值说明</h3>
            <p>请按照上方提醒的充值金额进行充值，不是按照您输入的金额，我们会对您的输入金额进行稍微调整。</p>
            <p>1⃣️、小于100元不如账。</p>
            <p>2⃣️、输入充值金额请尽量带两位小数，能更快到账。</p>
            <p>3⃣️、卡号有可能随时变请注意充值时候的具体卡号。</p>
            <p>4⃣️、夜间请勿使用支付宝或微信转到银行卡，因为夜间支付宝转银行卡有可能延迟到账，夜间尽量使用手机银行APP转账。</p>
            <p>5⃣️、转账后请耐心等待5~10分钟，到账时间一般为5分钟内。</p>
        </div>
    </div>
    <van-dialog
        v-model="dialogShow"
        :title="dialogTitle"
        show-cancel-button
        confirm-button-text="提交"
        confirm-button-color="#ff3300"
        :before-close="beforeClose"
    >
        <div class="dialog-content">
            <p class="tip">
                <span class="title">提示：</span>
                请输入要充值的金额（输入不要为整数，请输入两位小数的充值金额，比如：125.15/502.39/5003.54）
            </p>
            <div class="form-wp">
                <p class="amount">
                    余额：<span>¥ 1213.23</span>
                </p>
                <van-cell-group>
                    <van-field v-model="accountMoney" type="number" placeholder="请输入充值金额">
                        <span slot="right-icon">元</span>
                    </van-field>
                </van-cell-group>
            </div>
        </div>
    </van-dialog>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common';
export default {
    name: 'UserRecharge',
    components: { Topbar },
    data() {
        return {
            dialogShow: false,
            dialogTitle: '',
            accountMoney: '',
        };
    },
    methods: {
        openDialog(type) {
            let eme = {
                0: '银行卡充值',
                1: '支付宝充值',
            };
            if (type == 0) {
                this.$toast('暂不支持银行卡充值');
                return false;
            }
            this.dialogTitle = eme[type];
            this.dialogShow = true;
        },
        beforeClose(action, done) {
            if (action === 'confirm') {
                if (!this.accountMoney) {
                    this.$notify('请输入充值金额！');
                    done(false);
                    return false;
                }
                this.$fly.post('/api/CompanyOption/GetReChargeList', {
                    appId: localStorage.getItem('appid'),
                    accountMoney: this.accountMoney,
                }).then((res) => {
                    let { returnCode, returnMsg, data } = res;
                    this.$toast(returnMsg);
                    if (returnCode == 100) {
                        done();
                    } else {
                        done(false);
                    }
                })
            } else {
                done();
            }
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.user-recharge {
    .container {
        padding: 15px;
        .handler-group {
            background-color: #fff;
            box-shadow: 0 0 8px #eee;
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
            .icon {
                width: 6rem;
                padding: 10px 0;
            }
            .name {
                padding: 10px 0;
                font-size: 14/11rem;
            }
        }
        .detail {
            font-size: 14/11rem;
            line-height: 1.7;
            padding: 10px 0;
            h3 {
                font-weight: 800;
                margin-bottom: 8px;
            }
            p {
                color: #666;
                margin-bottom: 8px;
            }
        }
    }
    .dialog-content {
        padding: 15px;
        .tip {
            font-size: 12/11rem;
            padding: 0 0 15px 0;
            color: #666;
            .title {
                color: #f40;
            }
        }
        .form-wp {
            padding: 15px 10px;
            box-shadow: 0 0 8px #eee;
            border-radius: 8px;
            .amount {
                text-align: center;
                padding: 10px 0 20px 0;
                span {
                    color: #ff3300;
                    font-size: 21/11rem;
                    font-weight: 800;
                    margin-left: 10px;
                }
            }
            .van-cell {
                background-color: #eee;
            }
        }
    }
}
</style>