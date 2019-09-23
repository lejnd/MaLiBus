<template>
<div class='user-info'>
    <topbar title="个人资料"></topbar>
    <div class="container">
        <div class="form-wp">
            <div class="tip">请填写你的信息</div>
            <van-cell-group>
                <van-field :value="user.tel" label="账号" disabled placeholder="请输入用户名" />
                <van-field :value="user.parent_id" label="我的上级" disabled placeholder="请输入用户名" />
                <van-field v-model="name" label="呢称" placeholder="请输入用户名" />
                <van-field v-model="wechat" label="V" placeholder="请输入微信号" />
                <van-field v-model="qq" label="Q" placeholder="请输入QQ号" />
                <van-cell title="更改密码" is-link to="/user/password" />
            </van-cell-group>
        </div>
        <div class="btn-group">
            <van-button class="btn" type="info" @click="submit">确定提交</van-button>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import SmscodeBtn from '@/components/smscode-button.vue';
import { mapActions, mapGetters } from 'vuex';
import common from '../components/common'

export default {
    name: 'UserInfo',
    components: { Topbar, SmscodeBtn },
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
            wechat: '',
            qq: '',
        };
    },
    watch: {
        user() {
            this.setValue();
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
        user() {
            return Object.assign({}, this.userInfo, {
            })
        },
        myTel() {
            if (this.user.tel) {
                let tel = this.user.tel.toString();
                return tel.substr(0, 3) + '****' + tel.substr(7, 4)
            }
            return '**'
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo',
        ]),
        submit() {
            if (!this.name) {
                this.$notify('请输入昵称')
                return false
            }
            this.$fly.post('/api/User/UpdateUserInfo', {
                nick: this.name,
                wechat: this.wechat,
                qq: this.qq,
                appid: localStorage.getItem('appid'),
                img: ''
            }).then((res) => {
                let { returnCode, returnMsg } = res;
                this.$toast(returnMsg);
                if (returnCode == 100) {
                    this.getUserInfo().then(() => {
                        this.setValue();                        
                    })
                }
            })
        },
        setValue() {
            this.name = this.user.nick;
            this.wechat = this.user.wechat;
            this.qq = this.user.qq;
        }
    },
    mounted() {
        this.setValue();
    },
}
</script>

<style lang='less'>
.user-info {
    .form-wp {
        padding-bottom: 40px;
        .tip {
            padding: 0 15px;
            background-color: #fe853a;
            color: #fff;
            font-size: 12/11rem;
            line-height: 36px;
        }
        .deco {
            padding: 10px 15px;
            background-color: #eee;
            color: #666;
            font-size: 12/11rem;
        }
        .van-cell {
            line-height: 30/11rem;
            font-size: 15/11rem;
        }
        .flex-box {
            display: flex;
            align-items: center;
            .codeBtn {
                width: 120px;
                margin-left: 10px;
                height: 46px;
            }
        }
    }
    .btn-group {
        padding: 0 15px;
        .btn {
            width: 100%;
            border-radius: 6px;
        }
    }
}
</style>