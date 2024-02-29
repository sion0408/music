<template>
    <t-layout-page>
        <t-layout-page-item>
            <div style="display: flex;align-items: center;">
                <label>channel:</label>
                <el-input style="width: 60%" placeholder="请输入channel" v-model="channel"></el-input>
                <el-button style="margin-left:15px;" type="primary" :disabled="!channel"
                    @click="isPlay = true">点击开始</el-button>
            </div>
        </t-layout-page-item>
        <t-layout-page-item v-if="isPlay">
            <div class="container">
                <div class="user">
                    <div class="local">
                        <label>本地视频:</label>
                        <div v-if="localUserVideo" class="player user-player" ref="localVideo" v-player="localUserVideo">
                        </div>
                    </div>
                    <div class="remote">
                        <label>远程视频:</label>
                        <div class="player user-player" v-for="video in remoteUserVideo" ref="remoteVideo" :key="video.uid"
                            v-player="video"></div>
                    </div>
                </div>
                <agora :channel="channel">
                    <agora-video-sender type="camera" :config="{ facingMode: 'environment' }"
                        :playerConfig="{ fit: 'contain', mirror: false }" :encoder="encoderConfig" optimization="detail"
                        @video-ready="handleLocalUserVideo" customizationPlayer></agora-video-sender>
                    <agora-video-receiver :playerConfig="{ fit: 'contain', mirror: false }" customizationPlayer
                        @video-ready="handleRemoteVideoVideo"></agora-video-receiver>
                </agora>
            </div>
        </t-layout-page-item>
    </t-layout-page>
</template>

<script>
export default {
    data() {
        return {
            channel: '7',
            isPlay: false,
            localUserVideo: null,
            encoderConfig: { height: { max: 1920, min: 1920 }, width: { max: 1080, min: 1080 }, bitrateMax: 15000, bitrateMin: 15000, frameRate: { max: 15, min: 5 } },
            remoteUserVideo: [],
            filmUid: 999999
        }
    },
    mounted() {
    },
    methods: {
        // 获取本地视频流
        handleLocalUserVideo(video) {
            console.log('1111-----------', video)
            this.localUserVideo = video
            setTimeout(() => {
                // // 获取video并添加controls属性
                // this.$refs.localVideo.children[0].children[0].controls = 'controls'
                const items = this.$refs?.localVideo?.getElementsByTagName('video') || []
                // console.log('----', items)
                for (let i = 0; i < items.length; i++) {
                    items[i].controls = 'controls'
                }
            }, 0)
        },
        // 获取远程视频流
        handleRemoteVideoVideo(videos) {
            console.log('222-----------', videos)
            this.remoteUserVideo = videos.filter((v) => v.uid !== this.filmUid)
            setTimeout(() => {
                // 获取video并添加controls属性
                for (let index = 0; index < this.$refs.remoteVideo.length; index++) {
                    const items = this.$refs.remoteVideo[index].getElementsByTagName('video')
                    for (let i = 0; i < items.length; i++) {
                        items[i].controls = 'controls'
                    }
                }
            }, 0)
        }
    }
}
</script>
<style lang="scss" scoped>
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .player {
        overflow: hidden;
        background-color: black;
    }

    .user {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;

        .local {
            display: flex;
            justify-content: flex-start;
            flex-direction: column;

            label {
                text-align: left;
                font-weight: 700;
            }
        }

        .remote {
            margin-left: 10px;
            padding-left: 15px;
            border: 1px solid #eee;
            display: flex;
            justify-content: flex-start;
            flex-direction: column;

            label {
                text-align: left;
                font-weight: 700;
            }
        }
    }

    .user-player {
        width: 300px;
        height: 300px;
        margin: 5px 0;
    }
}
</style>

