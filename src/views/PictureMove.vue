<template>
  <div id="main">
    <div class="next">
      <el-button type="primary" @click="getPrev">上一张</el-button>
      <el-button type="primary" @click="getNext">下一张</el-button>
    </div>
    <div class="move">
      <el-select v-model="directory" placeholder="请选择">
        <el-option
          v-for="item in dropDownBox"
          :key="item.value"
          :label="item.key"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button class="move-picture" type="primary" @click="movePicture">移动</el-button>
    </div>
    <div class="info">
      <el-input class="name" placeholder="请输入内容" v-model="pictureInfo.name" :disabled="true">
        <template slot="prepend">图片名称</template>
      </el-input>
      <el-input class="path" placeholder="请输入内容" v-model="pictureInfo.path" :disabled="true">
        <template slot="prepend">图片路径</template>
      </el-input>
      <el-input class="size" placeholder="请输入内容" v-model="pictureInfo.size" :disabled="true">
        <template slot="prepend">图片大小</template>
      </el-input>
    </div>
    <div class="img-info">
      <el-image :src="pictureUrl" fit="contain" style="height: 1200px; width: 2400px;"></el-image>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "PictureMove",
  mounted () {
    this.getDropDown()
    this.getLocal()
    this.getCurrentPictureInfo()
  },
  data () {
    return {
      pictureUrl: "",
      dropDownBox: {},
      directory: "",
      pictureInfo: {
        path: "",
        name: "",
        size: 0.0
      }
    }
  },
  methods: {
    getDropDown () {
      axios.get("http://localhost:8082/picture/location")
        .then(response => {
          this.dropDownBox = response.data
        })
    },
    getLocal () {
      axios.get("http://localhost:8082/picture/getLocalPicture", { responseType: "blob" })
        .then(response => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;

            reader.readAsDataURL(response.data)
          });
        })
        .then(data => {
          this.pictureUrl = data;
        })
        .catch(error => {
          console.error("Error:", error);
          this.pictureUrl = ""
        })
    },
    getPrev () {
      axios.get("http://localhost:8082/picture/getPrevPicture", { responseType: "blob" })
        .then(response => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;

            reader.readAsDataURL(response.data)
          });
        })
        .then(data => {
          this.pictureUrl = data;

          this.directory = "1"
          this.getCurrentPictureInfo();
        })
        .catch(error => {
          console.error("Error:", error);
          this.pictureUrl = ""
          this.directory = ""
        });
    },
    getNext () {
      axios.get("http://localhost:8082/picture/getNextPicture", { responseType: "blob" })
        .then(response => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;

            reader.readAsDataURL(response.data)
          });
        })
        .then(data => {
          this.pictureUrl = data;
          this.directory = "1"

          this.getCurrentPictureInfo();
        })
        .catch(error => {
          console.error("Error:", error);
          this.pictureUrl = ""
          this.directory = ""
        });
    },
    getCurrentPictureInfo () {
      axios.get("http://localhost:8082/picture/getPictureInfo")
        .then(response => {
          let data = response.data
          this.pictureInfo.name = data.name
          this.pictureInfo.path = data.path
          this.pictureInfo.size = data.size

          this.pictureInfo.size = this.pictureInfo.size.toFixed(2)
        });
    },
    movePicture () {
      if (this.directory === null || this.directory.length === 0) {
        this.$message.error("请先选择目标文件夹！");
        return;
      }

      axios.post("http://localhost:8082/picture/setPictureLocation/" + this.directory)
        .then(response => {
          let isMoved = response.data

          if (isMoved) {
            this.$notify.success({
              title: '图片移动成功',
              message: ''
            });
          } else {
            this.$notify.error({
              title: '图片移动失败',
              message: '原因：'
            });
          }

          this.getCurrentPictureInfo()
        })
    }
  }
}
</script>

<style>
#main > div {
  margin-top: 10px;
}

.move-picture {
  margin-left: 10px;
}

.info {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.info > .name {
  width: 270px;
}

.info > .path {
  width: 400px;

  margin: 0 20px;
}
.info > .size {
  width: 170px;
}
</style>