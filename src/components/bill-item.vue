<template>
<div class="bill-item">
    <div class="item-top">
        <h3 class="id">订单号：<span>{{item.task_id}}</span></h3>
        <span class="overtime" v-if="item.status==0 || item.status==2 || item.status==3">{{overtime}}</span>
    </div>
    <p class="deco">
        <span>手机号：{{formTel(item.tel)}}({{item.user_provcode_name}})</span>
        <span class="time">{{item.create_time}}</span>
    </p>
    <div class="flex-box">
        <div class="info">
            单价：<span class="value">¥{{item.real_money}}</span> （{{item.province_name}}）
        </div>
        <span class="status">{{item.task_status_des}}</span>
    </div>
    <div class="remark">备注：<span>{{item.remark || '无备注'}}</span></div>
    <div class="btn-group">
        <!-- <van-button type="info" size="small" :disabled="disable" @click="setTaskStatus(2)">辅助失败</van-button> -->
        <van-button v-if="item.status == 2 && !item.is_mobile_assist" type="info" size="small" @click="failHandler">辅助失败</van-button>
        <van-button v-if="item.status == 2 && !item.is_mobile_assist" type="primary" size="small" @click="setTaskStatus(1)">辅助成功</van-button>
        <van-button v-if="item.status >= 8 || item.status == 6" type="info" size="small" @click="uploadDialog=true" :disabled="item.upload_img?true:false">{{item.upload_img ? '已上传图片' : '传未过图'}}</van-button>
        <van-button v-if="item.status != 0 && item.status != 2" size="small" @click="remarkDialog=true">添加备注</van-button>
    </div>
    <van-dialog
        v-model="uploadDialog"
        title="传未过图"
        show-cancel-button
        :show-confirm-button="false"
    >
        <div class="dialog-content">
            <!-- <p class="tip">
                <span class="title">提示：</span>
                输入价格最低6.5元，最高30元
            </p> -->
            <div class="form-wp">
                <div class="center">
                    <van-uploader :after-read="afterRead" :max-count="1" @delete="imgUrl=''">
                        <van-image width="100" height="100" :src="imgUrl">
                            <template v-if="isUploading" v-slot:error>
                                <van-loading type="spinner" size="20" />
                            </template>
                            <template v-else v-slot:error>点击上传</template>
                        </van-image>
                    </van-uploader>
                </div>
            </div>
        </div>
    </van-dialog>
    <van-dialog
        v-model="remarkDialog"
        title="添加备注"
        show-cancel-button
        confirm-button-text="提交"
        :before-close="beforeCloseRemark"
    >
        <div class="dialog-content">
            <div class="form-wp">
                <van-cell-group>
                    <van-field v-model="remark" type="textarea" placeholder="输入备注">
                    </van-field>
                </van-cell-group>
            </div>
        </div>
    </van-dialog>
</div>
</template>

<script>
import common from '@/components/common';

export default {
    name: '',
    components: {},
    props: {
        item: {
            type: Object,
            default: () => {},
        }
    },
    data() {
        return {
            overtime: '',
            // disable: true, 
            timer: -1,  // 倒计时轮询
            timer2: -1,    // 自动成功轮询   
            uploadDialog: false, 
            fileList: [], 
            imgUrl: '',
            remarkDialog: false,
            remark: '',
            isUploading: false,
        };
    },
    methods: {
        getOvertime(creatTime, min) {
            let date = new Date();
            let nTime = date.getTime();
            let cTime = new Date(creatTime).getTime();
            let timing = min * 60 * 1000; // 定时
            let result = nTime - cTime;   // 当前时间 - 创建时间
            // console.log(result, timing);
            return result > timing;
        },

        setOvertime() {
            this.timer = setInterval(() => {
                let date = new Date();
                let nTime = date.getTime();
                let cTime = new Date(this.item.create_time).getTime();
                let timing = 15 * 60 * 1000; // 15分钟定时
                let result = timing - (nTime - cTime);   // 15分钟 - (当前时间 - 创建时间)
                // console.log(this.item.task_id, result);
                this.overtime = this.formatSeconds(result);
                if (result <= 0) {
                    this.overtime = '超时'
                    window.clearInterval(this.timer)
                }
            }, 1000);
        },


        // setDisable() {
        //     if (this.item.task_status != 1) return;
        //     if (this.getOvertime(this.item.create_time, 5)) {
        //         this.disable = false;
        //     } else {
        //         this.timer = setInterval(() => {
        //             if (this.getOvertime(this.item.create_time, 5)) {
        //                 this.disable = false;
        //                 clearInterval(this.timer);
        //             }
        //         }, 5000)
        //     }
        // },
        autoSuccess() {
            if (this.item.task_status != 1) return;
            this.timer2 = setInterval(() => {
                if (this.getOvertime(this.item.create_time, 10)) {
                    window.clearInterval(this.timer2);
                    this.setTaskStatus(1);
                }
            }, 5000)
        },
        setTaskStatus(taskResult) {
            this.$fly.post('/api/CompanyOption/SetTaskStatus', {
                appId: localStorage.getItem('appid'),
                tel: this.item.tel,
                taskId: this.item.task_id,
                taskResult: taskResult
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$emit('replay')
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
        failHandler() {
            this.$dialog.confirm({
                title: '确认失败',
                message: '该订单失败？'
            }).then(() => {
                this.setTaskStatus(2)
            });
        },
        // 时间戳格式化为00:00
        formatSeconds(mss) {
            var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = parseInt((mss % (1000 * 60)) / 1000);
            hours = hours < 10 ? ('0' + hours) : hours;
            minutes = minutes < 10 ? ('0' + minutes) : minutes;
            seconds = seconds < 10 && seconds >= 0 ? ('0' + seconds) : seconds;
            return  minutes + " : " + seconds;
        },
        formTel(mobile) {
            if (mobile) {
                let tel = mobile.toString();
                return tel.substr(0, 3) + '**' + tel.substr(7, 4)
            }
            return '**'
        },
        // 传未过图
        afterRead(file) {
            this.imgUrl = '';
            this.isUploading = true;
            this.$fly.post('/api/File/UploadFile', common.obj2formdata({
                files: file.file,
                taskId: this.item.task_id,
            })).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$notify({
                        background: '#07c160',
                        message: returnMsg
                    }); 
                    this.imgUrl = data;
                    this.isUploading = false;
                    this.uploadDialog = false;
                    this.$emit('replay')
                } else {
                    this.$notify(returnMsg);                    
                }
            })
        },
        // beforeCloseUpload(action, done) {
        //     if (action === 'confirm') {
        //         if (!this.imgUrl) {
        //             this.$notify('请先上传图片');
        //             done(false);
        //             return false;
        //         }
        //         this.$fly.post('/api/CompanyOption/HandSetTask', {
        //             taskId: this.item.task_id,
        //             type: 1,
        //             upload_img: this.imgUrl
        //         }).then((res) => {
        //             let { returnCode, returnMsg, data } = res;
        //             if (returnCode == 100) {
        //                 this.$toast(returnMsg);  
        //                 this.imgUrl = '';
        //                 done();
        //             } else {
        //                 this.$notify(returnMsg); 
        //                 done(false);
        //             }
        //         })
        //     } else {
        //         done();
        //     }
        // },
        beforeCloseRemark(action, done) {
            if (action === 'confirm') {
                if (!this.remark) {
                    this.$notify('请输入备注');
                    done(false);
                    return false;
                }
                this.$fly.post('/api/CompanyOption/HandSetTask', {
                    taskId: this.item.task_id,
                    type: 1,
                    hand_remark: this.remark
                }).then((res) => {
                    let { returnCode, returnMsg, data } = res;
                    if (returnCode == 100) {
                        this.$toast(returnMsg);  
                        this.remark = '';
                        done();
                    } else {
                        this.$notify(returnMsg); 
                        done(false);
                    }
                })
            } else {
                this.remark = '';
                done();
            }
        }
    },
    mounted() {
        this.setOvertime();
        this.autoSuccess();
    },
}
</script>

<style lang='less'>
.bill-item {
    padding: 10px 10px 8px 10px;
    border-radius: 6px;
    box-shadow: 0 0 8px #eee;
    background-color: #fff;
    margin-bottom: 10px;
    .flex-box {
        display: flex;
        align-items: center;
        padding: 5px 0 0 0;
        .status {
            font-size: 14/11rem;
            color: #f40;
            padding-left: 30px;
            font-weight: 700;
            text-align: center;
        }
        .info {
            width: 60%;
            border-right: 1px solid #eee;
            font-size: 14/11rem;
            .value {
                color: #f40;
                font-weight: 700;
            }
        }
    }
    .remark {
        span {
            color: #999;
        }
    }
    // .row {
    //     line-height: 22px;
    //     display: flex;
    //     padding: 0 20px;
    //     color: #787878;
    //     span {
    //         // flex: 1;
    //         // text-align: center;
    //         padding-left: 10px;
    //     }
    // }
    .item-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .id {
            font-size: 14/11rem;
            span {
                font-weight: 700;
            }
        }
        .overtime {
            color: #f40;
            font-size: 12/11rem;
        }
    }
    .deco {
        padding: 5px 0;
        display: flex;
        justify-content: space-between;
        font-size: 12/11rem;
    }
    .btn-group {
        padding-top: 6px;
        display: flex;
        justify-content: space-evenly;
    }
    .dialog-content {
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
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
            .van-cell {
                background-color: #eee;
            }
            .center {
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>