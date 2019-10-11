<template>
<div class='user-transfer bg-f5'>
    <topbar title="余额转移"></topbar>
    <div class="container">
        <div class="amount">
            <span class="money">¥ {{user.account_money}}</span>
            <p class="text">账户余额</p>
        </div>
        <div class="form-wp">
            <van-cell-group>
                <van-field v-model="telTo" type="number" placeholder="请输入要接收款项的账号">
                </van-field>
                <van-field v-model="accountMoney" type="number" placeholder="请输入要转移的金额">
                    <span slot="right-icon">元</span>
                </van-field>
                <van-field v-model="transferPassword" type="password" placeholder="请输入转移密码">
                </van-field>
            </van-cell-group>
            <div class="handler">
                <van-icon name="lock" />
                <span @click="gotoPassword">设置转移密码</span>
            </div>
        </div>
        <p class="tip">
            <span class="title">提示：</span>
            可以把当前账号的金额转移到其他账户(仅限码力商家版内部用户，非支付宝和银行账户)，转移后金额不能撤销，请在转移前确认对方账号是否正确，码力平台不承担资金损失!
        </p>
        <div class="btn-group">
            <van-button class="btn" type="info" @click="transferMoney" :loading="isLoading">确定提交</van-button>
        </div>
        <span class="detail" @click="gotoLogs">查看转移明细</span>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'
import { mapActions, mapGetters } from 'vuex';
export default {
    name: 'UserTransfer',
    components: { Topbar },
    data() {
        return {
            telTo: '',
            accountMoney: '',
            transferPassword: '',
            isLoading: false,
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
        user() {
            return Object.assign({}, this.userInfo, {
            })
        },
    },
    methods: {
        ...mapActions([
            'getUserInfo',
        ]),
        transferMoney() {
            if (!this.telTo) {
                this.$notify('请输入要接收款项的账号')
                return false
            }
            if (!this.accountMoney) {
                this.$notify('请输入要转移的金额')
                return false
            }
            if (this.accountMoney < 10) {
                this.$notify('转移的金额不能低于10元')
                return false
            }
            if (this.accountMoney > this.user.account_money) {
                this.$notify('转移的金额不能大于账户余额')
                return false
            }
            if (!this.transferPassword) {
                this.$notify('转移密码必填')
                return false
            }
            this.isLoading = true;
            this.$fly.post('/api/CompanyOption/TransferMoney', {
                telTo: this.telTo,
                telFrom: localStorage.getItem('tel'),
                accountMoney: this.accountMoney,
                transferPassword: this.transferPassword,
            }).then((res) => {
                this.isLoading = false;
                let { returnCode, returnMsg } = res;
                this.$dialog.alert({
                    message: returnMsg
                });
                this.getUserInfo();
            })
        },
        gotoLogs() {
            this.$router.push('/user/transferLogs');
        },
        gotoPassword() {
            this.$router.push('/user/password?transfer=1');
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.user-transfer {
    .container {
        padding: 25px 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .amount {
            padding: 25px;
            background: linear-gradient(left, #ff9924, #fe5300);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            .money {
                color: #ffda54;
                font-size: 22/11rem;
                font-weight: 800;
            }
            .text {
                color: #fff;
                padding-top: 10px;
                font-size: 14/11rem;
            }
        }
        .form-wp {
            // box-shadow: 0 0 8px #eee;
            border-radius: 8px;
            width: 100%;
            .van-cell-group {
                background-color: #f5f5f5;
            }
            .van-cell {
                background-color: #ddd;
                margin-bottom: 15px;
            }
            .handler {
                padding-bottom: 10px;
                color: #1989fa;
                display: flex;
                align-items: center;
                justify-content: center;
                span {
                    padding: 5px;
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
        .btn-group {
            padding: 15px 0;
            width: 100%;
            .btn {
                width: 100%;
                border-radius: 6px;
            }
        }
        .detail {
            font-size: 14/11rem;
            color: #ff6f0d;
            padding: 5px;
        }
    }
}
</style>