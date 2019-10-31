<template>
<div class='user-data'>
    <topbar title="数据查询"></topbar>
    <div class="container">
        <div class="content">
            <div class="user">
                <div class="avatar">
                    <img src="../assets/img/logo.jpeg" alt="">
                </div>
                <p class="text">账户：{{user.tel}}</p>
            </div>
            <div class="form-wp">
                <date-select @getDate="getDate"></date-select>
                <van-grid :border="false" :column-num="3">
                    <van-grid-item to="/userRecharge">
                        <span class="value">{{dataInfo.total}}</span>
                        <span class="title">总下单</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">{{dataInfo.success_count}}</span>
                        <span class="title">日成功</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">{{dataInfo.success_rate}}%</span>
                        <span class="title">日成功率</span>
                    </van-grid-item>
                    <van-grid-item to="/userRecharge">
                        <span class="value">{{dataInfo.wj_order}}</span>
                        <span class="title">日未接</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">{{dataInfo.wj_order_rate}}%</span>
                        <span class="title">日未接率</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">{{dataInfo.fail_count}}%</span>
                        <span class="title">日失败</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">{{dataInfo.fail_rate}}%</span>
                        <span class="title">日失败率</span>
                    </van-grid-item>
                </van-grid>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import DateSelect from '@/components/date-select.vue';
import { mapActions, mapGetters } from 'vuex';
import common from '../components/common'

export default {
    name: 'UserInfo',
    components: { Topbar, DateSelect },
    data() {
        return {
            codeBtnStyle: {
                backgroundColor: '#409eff',
                borderColor: '#409eff',
                width: '115px',
                borderRadius: '2px',
                marginLeft: '10px',
                height: '50px',
            },
            name: '',
            formDate: '',
            dataInfo: {},
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
        getDate(date) {
            this.formDate = date;
            this.getInfo();
        },
        getInfo() {
            this.$fly.get('/api/CompanyOption/GetTaskListByTelAndDate', {
                // appId: localStorage.getItem('appid'),
                date: this.formDate
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    if (data) {
                        this.dataInfo = Object.assign({}, data)
                    }
                } else {
                    this.$toast(returnMsg)
                }
            })
        }
    },
    mounted() {

    },
}
</script>

<style lang='less'>
.user-data {
    .container {
        .content {
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
                margin-bottom: 15px;
                width: 90%;
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
            }
        }
    }
}
</style>