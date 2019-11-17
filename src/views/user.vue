<template>
<div class='user-wp'>
    <home-top title="个人中心" handler-name="公告" @onClickRight="onClickRight">
        <van-icon name="volume" />
    </home-top>
    <div class="container">
        <div class="header">
            <div class="avatar">
                <img src="../assets/img/logo.jpeg" alt="">
            </div>
            <div class="info">
                <h2 class="name">{{user.nick}}</h2>
                <p class="deco">推荐码：{{user.invitation_code}}</p>
                <div class="tag">
                    <van-icon name="star" />
                    <span>放单者</span>
                </div>
            </div>
            <div class="amount">
                <h2 class="money">¥ {{user.account_money}}</h2>
                <p class="deco">我的余额</p>
                <van-button class="btn" size="mini" @click="isDevRecharge">充值</van-button>
            </div>
        </div>
        <div class="grid-wp">
            <van-grid :border="false" :column-num="3">
                <van-grid-item @click="isDevRecharge">
                    <img class="icon" src="../assets/img/grid1.jpeg" alt="">
                    <span class="title">充值中心</span>
                </van-grid-item>
                <van-grid-item to="/user/team">
                    <img class="icon" src="../assets/img/grid2.jpeg" alt="">
                    <span class="title">下级列表</span>
                </van-grid-item>
                <van-grid-item :to="`/user/invite?code=${user.invitation_code}`">
                    <img class="icon" src="../assets/img/grid3.jpeg" alt="">
                    <span class="title">推荐下级</span>
                </van-grid-item>
                <van-grid-item to="/rechargeLogs">
                    <img class="icon" src="../assets/img/grid4.jpeg" alt="">
                    <span class="title">充值记录</span>
                </van-grid-item>
                <van-grid-item to="/user/transfer">
                    <img class="icon" src="../assets/img/grid5.jpeg" alt="">
                    <span class="title">余额转移</span>
                </van-grid-item>
                <van-grid-item to="/amountLogs">
                <!-- <van-grid-item @click="isDev"> -->
                    <img class="icon" src="../assets/img/grid6.jpeg" alt="">
                    <span class="title">余额明细</span>
                </van-grid-item>
            </van-grid>
        </div>
    </div>
    <div class="setting-list">
        <!-- 只有1级商家显示联系客服：user.parent_id=='0' -->
        <div class="item" @click="myWechat" v-if="user.parent_id=='0'">
            <h3>
                <van-icon class="icon" size="2.1rem" name="wechat" />
                联系客服
            </h3>
            <van-icon name="arrow" />
        </div>
        <router-link class="item" to="/course">
            <h3>
                <van-icon class="icon" size="2.1rem" name="question" />
                使用教程
            </h3>
            <van-icon name="arrow" />
        </router-link>
        <router-link v-for="(item, index) in settingList" :key="index" :to="item.to">
            <div class="item">
                <h3>
                    <span class="icon" :class="item.iconClass"></span>
                    {{item.name}}
                </h3>
                <van-icon name="arrow" />
            </div>
        </router-link>
        <div class="item" @click="loginout">
            <h3><span class="icon icon-exit"></span>退出登录</h3>
            <van-icon name="arrow" />
        </div>
    </div>
    <tab-bar :active="2"></tab-bar>
</div>
</template>

<script>
import HomeTop from '@/components/home-top.vue';
import TabBar from '@/components/tab-bar.vue';
import common from '../components/common';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'User',
    components: { HomeTop, TabBar },
    data() {
        return {
            settingList: [
                { to: '/user/info', name: '账户资料', iconClass: 'icon-profile' },
                { to: '/user/data', name: '数据查询', iconClass: 'icon-calendar' },
                { to: '/user/download', name: 'APP下载', iconClass: 'icon-cloud-download' },
            ]
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
            'getNotice',
            'getUserInfo',
        ]),
        isDev() {
            this.$toast('该功能正在完善，敬请期待')
        },
        isDevRecharge() {
            this.$toast('充值走线下，请联系客服')
        },
        loginout() {
            this.$dialog.confirm({
                message: '确定要退出登录吗？'
            }).then(() => {
                this.$fly.get('/api/User/LoginOut', common.connectObj())
                .then(() => {
                    localStorage.removeItem('Authorization');
                    localStorage.removeItem('tel');
                    localStorage.removeItem(`notice_${this.noticeId}`)
                    this.$router.replace('/login');
                }).catch(() => {
                    this.$toash('注销失败')
                })
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
        myWechat() {
            this.$dialog.alert({
                title: '联系客服',
                message: '<br>客服一VX：maliysw<br><br>客服二VX：a15587021686<br>',
                messageAlign: 'center',
            })
        }
    },
    mounted() {
        // this.getUserInfo();
    },
}
</script>

<style lang='less'>
.user-wp {
    padding-bottom: 50px;
    .container {
        padding: 15px;
        .header {
            padding: 15px;
            background: linear-gradient(left, #ff9924, #fe5300);
            border-radius: 8px;
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            .avatar {
                width: 5rem;
                height: 5rem;
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: 100%;
                }
            }
            .info {
                flex: 1;
                padding: 0 8px;
                color: #fff;
                .name {
                    font-size: 16/11rem;
                    font-weight: 700;
                    max-width: 140/11rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .deco {
                    font-size: 12/11rem;
                }
                .tag {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #fff;
                    width: 76/11rem;
                    color: #fe5701;
                    border-radius: 10px;
                    padding: 2px 0;
                    margin-top: 5px;
                    font-size: 12/11rem;
                    .van-icon {
                        margin-right: 5px;
                    }
                }
            }
            .amount {
                display: flex;
                flex-direction: column;
                align-items: center;
                .money {
                    font-size: 14/11rem;
                    color: #ffda54;
                }
                .deco {
                    padding: 3px 0 5px 0;
                    color: #fff;
                    font-size: 12/11rem;
                }
                .btn {
                    background-color: #ffda54;
                    color: #fe5701;
                    border-radius: 8px;
                    border: 0;
                    height: 20px;
                    min-width: 45px;
                }
            }
        }
        .grid-wp {
            border-radius: 8px;
            padding: 10px;
            background-color: #fff;
            box-shadow: 0 0 6px #eee;
            .icon {
                width: 5.6rem;
            }
            .title {
                margin-top: 10px;
                color: #666;
            }
        }
    }
    .setting-list {
        // padding: 10px 0;
        .item {
            padding: 15px 20px;
            border-bottom: 1px solid #f5f5f5;
            display: flex;
            align-items: center;
            background-color: #fff;
            color: #666;
            h3 {
                flex: 1;
                font-size: 16/11rem;
                color: #666;
                display: flex;
                align-items: center;
                .icon {
                    font-size: 22/11rem;
                    color: rgb(255, 131, 25);
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>