<template>
  <div class="illumination">
    <template>
      <baidu-map
        class="baidumap"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="true"
        @ready="handler"
        :averageCenter="true"
      >
        <!-- 土壤 -->
        <div v-for="(item) in markers1" :key="item.deviceId">
          <bm-marker
            v-if="item.status == 1"
            :icon="{
              url: require('../assets/img/soil.png'),
              size: { width: 40, height: 40 }
            }"
            :position="{ lng: item.lng, lat: item.lat }"
            @click="infoWindowOpen1(item, item.name)"
          ></bm-marker>
          <bm-marker
            v-if="item.status == 0"
            :icon="{
              url: require('../assets/img/soil3.png'),
              size: { width: 40, height: 40 }
            }"
            :position="{ lng: item.lng, lat: item.lat }"
            @click="infoWindowOpen1(item, item.name)"
          ></bm-marker>
          <bm-info-window
            :position="{ lng: markLocation1.longitude, lat: markLocation1.latitude }"
            :show="showFlag1"
          >
            <p style="color: #409eff;">{{ markLocation1.name }}</p>
            <p>温度：{{markLocation1.temperature}}</p>
            <p>湿度：{{markLocation1.humidity}}</p>
            <p>盐度：{{markLocation1.salinity}}</p>
          </bm-info-window>
        </div>
        <!-- 水表 -->
        <div v-for="(marker,index) in markers" :key="index">
          <!-- 开 -->
          <bm-marker
            v-if="marker.isOPen == 1"
            :icon="{
              url: require('../assets/img/irr1.png'),
              size: { width: 40, height: 40 }
            }"
            :position="{ lng: marker.lng, lat: marker.lat }"
            @click="infoWindowOpen(marker)"
          ></bm-marker>
          <!-- 关 -->
          <bm-marker
            v-if="marker.isOPen == 0"
            :icon="{
              url: require('../assets/img/irr.png'),
              size: { width: 40, height: 40 }
            }"
            :position="{ lng: marker.lng, lat: marker.lat }"
            @click="infoWindowOpen(marker)"
          ></bm-marker>
          <!-- 在线 -->
          <bm-marker
            v-if="marker.status == 1"
            :icon="{
              url: require('../assets/img/irr.png'),
              size: { width: 40, height: 40 }
            }"
            :position="{ lng: marker.lng, lat: marker.lat }"
            @click="infoWindowOpen(marker)"
          ></bm-marker>
          <!-- 离线 -->
          <bm-marker
            v-if="marker.status == 0"
            :icon="{
              url: require('../assets/img/irr3.png'),
              size: { width: 40, height: 40 }
            }"
            :position="{ lng: marker.lng, lat: marker.lat }"
            @click="infoWindowOpen(marker)"
          ></bm-marker>
          <bm-info-window
            :position="{ lng: markLocation.longitude, lat: markLocation.latitude }"
            :show="showFlag"
            style="height: 175px"
          >
            <p style="color: #409eff;">{{ markLocation.deviceName }}</p>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="基础面板" name="first">
                <p style="line-height: 17px;">
                  <span class="mapChartTit">设备状态：</span>
                  <span class="right" v-if="markLocation.isOPen == 1">开启</span>
                  <span class="right" v-if="markLocation.isOPen == 0">关闭</span>
                </p>
                <p style="line-height: 17px;">
                  <span class="mapChartTit">累计用水量：</span>
                  <span class="right">{{ markLocation.totalWatering }}m³</span>
                </p>
                <p style="line-height: 17px;">
                  <span class="mapChartTit">灌溉次数：</span>
                  <span class="right">{{ markLocation.totalWaterNum }}次</span>
                </p>
                <p style="line-height: 17px;">
                  <span class="mapChartTit">上月灌溉次数：</span>
                  <span class="right">{{ markLocation.lastWaterNum }}次</span>
                </p>
                <p style="line-height: 17px;">
                  <span class="mapChartTit">上月用水量：</span>
                  <span class="right">{{ markLocation.lastWatering }}m³</span>
                </p>
                <p style="line-height: 17px;">
                  <span class="mapChartTit">灌溉点面积：</span>
                  <span class="right">{{ markLocation.irrigationArea }}m³</span>
                </p>
                <p>
                  <span class="mapChartTit" style="line-height: 35px;">阀门控制：</span>
                  <el-button
                    type="success"
                    plain
                    style="right:70px;position: absolute;width: 50px;padding: 5px 10px;bottom: 0"
                    @click="openDevice(markLocation.deviceId)"
                  >开启</el-button>
                  <el-button
                    type="danger"
                    plain
                    style="right:0px;position: absolute;width: 50px;padding: 5px 10px;bottom: 0"
                    @click="closeDevice(markLocation.deviceId)"
                  >关闭</el-button>
                </p>
              </el-tab-pane>
              <el-tab-pane label="报表" name="second">
                <span style="display: inline-block;width: 26%;">间隔选择</span>
                <select
                  name="sel"
                  v-model="mapValue"
                  style="background-color:#fff;color:#000;width: 23%"
                >
                  <option
                    v-for="item in mapOptions"
                    :key="item.mapValue"
                    :label="item.mapLabel"
                    :value="item.mapValue"
                  ></option>
                </select>
                <button
                  @click="mapDemand"
                  style="right: 13px;float: right;position: absolute;background-color: #409eff;border: none;color: #ffffff;
                padding-left: 10px;padding-right: 11px;line-height: 16px;"
                >查询</button>
                <div v-if="mapValue == '日'" class="comTop">
                  <span class="monitorPoint" style="width: 26%;">时间选择</span>
                  <select
                    v-model="mapYear"
                    class
                    style="background-color:#fff;color:#000;width: 23%"
                  >
                    <option
                      v-for="item in selectYearList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</option>
                  </select>
                  <select
                    v-model="mapMonth"
                    class
                    style="background-color:#fff;color:#000;width: 23%"
                  >
                    <option
                      v-for="item in selectMonthList"
                      :value="item.value1"
                      :key="item.value1"
                    >{{ item.label }}</option>
                  </select>
                  <select
                    v-model="mapDay"
                    class
                    style="background-color:#fff;color:#000;width: 23%"
                  >
                    <option
                      v-for="item in selectDayList"
                      :value="item.value2"
                      :key="item.value2"
                    >{{ item.label }}</option>
                  </select>
                  <select
                    v-model="mapYear1"
                    class="comTop"
                    style="background-color:#fff;color:#000;margin-left:26%;width: 23%"
                  >
                    <option
                      v-for="item in selectYearList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</option>
                  </select>
                  <select
                    v-model="mapMonth1"
                    class="comTop"
                    style="background-color:#fff;color:#000;width: 23%"
                  >
                    <option
                      v-for="item in selectMonthList"
                      :value="item.value1"
                      :key="item.value1"
                    >{{ item.label }}</option>
                  </select>
                  <select
                    v-model="mapDay1"
                    class="comTop"
                    style="background-color:#fff;color:#000;width: 23%"
                  >
                    <option
                      v-for="item in selectDayList"
                      :value="item.value2"
                      :key="item.value2"
                    >{{ item.label }}</option>
                  </select>
                </div>
                <div v-if="mapValue == '月'" class="comTop">
                  <span class="monitorPoint" style="width: 26%;">时间选择</span>
                  <select v-model="mapYear" style="background-color:#fff;color:#000;width: 23%">
                    <option
                      v-for="item in selectYearList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</option>
                  </select>
                  <select v-model="mapMonth" style="background-color:#fff;color:#000;width: 23%">
                    <option
                      v-for="item in selectMonthList"
                      :value="item.value1"
                      :key="item.value1"
                    >{{ item.label }}</option>
                  </select>
                  <select
                    v-model="mapYear1"
                    style="background-color:#fff;color:#000;margin-left:26%;width: 23%"
                    class="comTop"
                  >
                    <option
                      v-for="item in selectYearList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</option>
                  </select>
                  <select v-model="mapMonth1" style="background-color:#fff;color:#000;width: 23%">
                    <option
                      v-for="item in selectMonthList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</option>
                  </select>
                </div>
                <div v-if="mapValue == '年'" class="comTop">
                  <span class="monitorPoint" style="width: 26%;">时间选择</span>
                  <select v-model="mapYear" style="background-color:#fff;color:#000;width: 23%">
                    <option
                      v-for="item in selectYearList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</option>
                  </select>
                  <select
                    v-model="mapYear1"
                    class="comTop"
                    style="margin-left:26%;display:block;width: 23%;background-color:#fff;color:#000;"
                  >
                    <option
                      v-for="item in selectYearList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</option>
                  </select>
                </div>
                <div class="chart" id="mapChart"></div>
              </el-tab-pane>
            </el-tabs>
          </bm-info-window>
        </div>
      </baidu-map>
    </template>
    <!-- 左侧面板 -->
    <div class="leftside">
      <div class="waterMonitor">
        <div class="asideBg comTop">
          <span class="waterMonitorTit">灌溉分析</span>
          <span class="right">water monitoring</span>
        </div>
      </div>
      <div class="electricity-show-img">
        <div class="img-item">
          <div class="circle__wrapper">
            <div class="value" style="color:#00FFFF">{{ total }}</div>
            <div class="unit" style="color:#00FFFF">kw/h</div>
          </div>
          <div style="text-align:center;margin-top:4px;color:#00FFFF">总耗水量</div>
        </div>
        <div class="img-item">
          <div class="circle__wrapper">
            <div class="value" style="color:#00FFFF">{{ thisNum3 }}</div>
            <div class="unit" style="color:#00FFFF">kw/h</div>
          </div>
          <div style="text-align:center;margin-top:4px;color:#00FFFF">上月用水</div>
        </div>
        <div class="img-item">
          <div class="circle__wrapper">
            <div class="value" style="color:#00FFFF">{{ economizeWater }}</div>
            <div class="unit" style="color:#00FFFF">kw/h</div>
          </div>
          <div style="text-align:center;margin-top:4px;color:#00FFFF">节省水量</div>
        </div>
        <div class="img-item">
          <div class="circle__wrapper1">
            <div class="value" style="color:#FFAE11">{{ economizeMoney }}</div>
            <div class="unit" style="color:#FFAE11">万元</div>
          </div>
          <div style="text-align:center;margin-top:4px;color:#FFAE11">节省金额</div>
        </div>
      </div>
      <div style="margin-top:10px">
        <span>上月节省水量</span>
        <span class="right">{{ economize3 }}m³</span>
      </div>
      <div style="margin-top:10px">
        <span class>上月节省金额</span>
        <span class="right">{{ money3 }}元</span>
      </div>
      <div style="margin-top:10px">
        <span class>上月智能灌溉区用水量</span>
        <span class="right">{{ thisNum1 }}m³</span>
      </div>
      <div style="margin-top:10px">
        <span class>上月普通区灌溉用水量</span>
        <span class="right">{{ thisNum2 }}m³</span>
      </div>
      <div class="waterAlarm">
        <div class="asideBg" style="margin-top:10px">
          <span class="waterMonitorTit">各项水量使用情况</span>
          <span class="right">water alarm record</span>
        </div>
        <div class="comTop">
          <div class="percent">
            <span style="margin-right: 15%;">智能灌溉区</span>
            <span class="percentValue">{{ zhi }}</span>
            <span>m³</span>
          </div>
          <!-- <el-progress :percentage="zhiPro"></el-progress> -->
          <div style="clear:both"></div>
        </div>
        <div class="comTop">
          <div class="percent">
            <span style="margin-right: 15%;">普通灌溉区</span>
            <span class="percentValue">{{ pu }}</span>
            <span>m³</span>
          </div>
          <!-- <el-progress :percentage="puPro"></el-progress> -->
          <div style="clear:both"></div>
        </div>
      </div>
      <div class="waterMonitor">
        <div class="asideBg comTop">
          <span class="waterMonitorTit">用水趋势</span>
          <span class="right">water monitoring</span>
        </div>
      </div>
      <div class="comTop">
        <span class="monitorPoint">监测点</span>
        <select v-model="deviceValue" style="width:50%">
          <option
            v-for="(item,index) in deviceOptions"
            :key="index"
            :label="item.deviceLabel"
            :value="item.deviceValue"
          ></option>
        </select>
        <button class="pointLeft monitorPoint" style="width:22%" @click="demand">查询</button>
      </div>
      <div class="comTop">
        <span class="monitorPoint">间隔选择</span>
        <select name="sel" v-model="timeIntervalValue">
          <option
            v-for="(item,index) in timeIntervaloptions"
            :key="index"
            :label="item.timeIntervalLabel"
            :value="item.timeIntervalValue"
          ></option>
        </select>
        <span class="monitorPoint1">类别选择</span>
        <select class="sel" v-model="value">
          <option
            v-for="(item,index) in waterTypeList"
            :key="index"
            :value="item.value"
          >{{ item.label }}</option>
        </select>
      </div>
      <div>
        <div v-if="timeIntervalValue == '日'" class="comTop">
          <span class="monitorPoint">时间选择</span>
          <select v-model="selectYear" class style="margin-right:4%">
            <option
              v-for="(item,index) in selectYearList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <select v-model="selectMonth" class style="margin-right:4%">
            <option
              v-for="(item,index) in selectMonthList"
              :value="item.value1"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <select v-model="selectDay" class style="margin-right:4%">
            <option
              v-for="(item,index) in selectDayList"
              :value="item.value2"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <select v-model="selectYear1" class="comTop" style="margin-right:4%;margin-left:19%">
            <option
              v-for="(item,index) in selectYearList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <select v-model="selectMonth1" class="comTop" style="margin-right:4%">
            <option
              v-for="(item,index) in selectMonthList"
              :value="item.value1"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <select v-model="selectDay1" class="comTop" style="margin-right:4%">
            <option
              v-for="(item,index) in selectDayList"
              :value="item.value2"
              :key="index"
            >{{ item.label }}</option>
          </select>
        </div>
        <div v-if="timeIntervalValue == '月'" class="comTop">
          <span class="monitorPoint">时间选择</span>
          <select v-model="selectYear" style="margin-right: 4%;">
            <option
              v-for="(item,index) in selectYearList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <select v-model="selectMonth" class>
            <option
              v-for="(item,index) in selectMonthList"
              :value="item.value1"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <!-- <div class="comTop" style="margin-left: 19%;"> -->
          <select v-model="selectYear1" style="margin-right: 4%;margin-left: 19%;" class="comTop">
            <option
              v-for="(item,index) in selectYearList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <select v-model="selectMonth1" class>
            <option
              v-for="(item,index) in selectMonthList"
              :value="item.value1"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <!-- </div> -->
        </div>
        <div v-if="timeIntervalValue == '年'" class="comTop">
          <span class="monitorPoint">时间选择</span>
          <select v-model="selectYear" style="margin-right: 4%;">
            <option
              v-for="(item,index) in selectYearList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <select v-model="selectYear1" class="comTop" style="margin-left: 19%;display:block">
            <option
              v-for="(item,index) in selectYearList"
              :value="item.value"
              :key="index"
            >{{ item.label }}</option>
          </select>
        </div>
      </div>
      <div class="chart" id="myChart1"></div>
      <div class="waterAlarm">
        <div class="asideBg comTop">
          <span class="waterMonitorTit">土壤墒情记录</span>
          <span class="right">water alarm record</span>
        </div>
        <div class="comTop">
          <span class="monitorPoint">设备选择</span>
          <select v-model="soilDeviceValue" class style="margin-right:4%;width:35%">
            <option
              v-for="(item,index) in soilOption"
              :value="item.deviceValue"
              :label="item.deviceLabel"
              :key="index"
            >{{ item.deviceLabel }}</option>
          </select>
          <!-- <select v-model="selectWarnMonth1" class style="margin-right:4%;width:18%">
            <option
              v-for="(item,index) in selectMonthList"
              :value="item.value1"
              :key="index"
            >{{ item.label }}</option>
          </select>
          <select v-model="selectWarnDay1" class style="margin-right:4%;width:18%">
            <option
              v-for="(item,index) in selectDayList"
              :value="item.value2"
              :key="index"
            >{{ item.label }}</option>
          </select>-->
          <button
            class="pointLeft monitorPoint"
            style="width: 15%;margin-left:0"
            @click="demand1"
          >查询</button>
        </div>
        <div class="comTop" style="display:flex">
          <span style="flex:0.8;text-align:left">灌溉用水</span>
          <span style="flex:0.8;text-align:left">灌溉时长</span>
          <span style="flex:1.2;text-align:center">起末土壤墒情</span>
          <span style="flex:0.8;text-align:right">上升比例</span>
          <span style="flex:1.5;text-align:center">时间</span>
        </div>

        <div style="overflow-y:scroll;width:100%;height:150px" class="soilData">
          <div class="comTop" style="display:flex;" v-for="(item, index) in soilData" :key="index">
            <span style="flex:0.8;text-align:left">{{ item.wateringNum }}</span>
            <span style="flex:0.8;text-align:left">{{ item.wateringTime }}</span>
            <span style="flex:1.2;text-align:center">{{ item.soilMoisture }}</span>
            <span style="flex:0.5;text-align:right">{{ item.riseRatio }}</span>
            <span style="flex:2;text-align:center">{{ item.createTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧操作板 -->
    <!-- <div class="rightside"> -->
    <div class="topside">
      <operation v-if="operation"></operation>
      <alarm v-if="alarm"></alarm>
      <div class="set" @click="operationShow">
        <img src="../assets/img/设置面板未点击时.png" alt />
      </div>
      <img
        @click="getHint"
        src="../assets/img/ti.png"
        alt
        style="position: absolute;top: 50px;right: 100px;width:35px"
      />
      <!-- <img
        src="../assets/img/errIcon.png"
        alt
        style="position: absolute;top: 50px;right: 50px;width:35px"
        @click="alarmShow"
      />-->
      <div class="hintBg" v-show="isShowHint">
        <img
          src="../assets/img/关闭.png"
          alt
          style="width: 20px;height: 20px;right: 0;position: absolute;bottom: 0;margin: 10px;"
          @click="closeHint"
        />
        <div style="line-height:30px">
          <span style="font-size: 15px;">正在灌溉：</span>
          <span v-if="hintCon == 1" style="float:right;color:#05e6e7">没有正在执行的策略</span>
          <span v-if="hintCon == 0" style="float:right;color:#05e6e7">{{jobName}}</span>
        </div>
        <div style="line-height:30px">
          <span style="font-size: 15px;">开启的灌溉设备：</span>
          <span
            v-for="(item,index) in lampList1"
            :key="index"
            style="margin-right:10px"
          >{{ item.deviceName }}</span>
        </div>
        <div style="line-height:30px">
          <span style="font-size: 15px;">灌溉水表状态：</span>
          <span :key="index" style="float:right;">正常</span>
        </div>
        <div style="line-height:30px">
          <span style="font-size: 15px;">策略结束时间：</span>
          <span :key="index" style="float:right;">{{ hintTime }}</span>
        </div>
        <div style="line-height:30px">
          <span style="font-size: 15px;">策略组剩余时间：</span>
          <span :key="index" style="float:right;">{{ hintNum }}分</span>
        </div>
        <div style="line-height:30px">
          <span style="font-size: 15px;">策略开启状态：</span>
          <span style="color:#03e405;float:right;" v-if="status == 1">安全策略已经开启</span>
          <span style="color:#ff0000;float:right;" v-if="status == 2">安全策略已经关闭</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import operation from "./operation";
import alarm from "./alarm";
export default {
  components: {
    operation,
    alarm
  },
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 5,
      // 控制子组件显示
      operation: false,
      alarm: false,
      timeIntervaloptions: [
        {
          timeIntervalValue: "年",
          timeIntervalLabel: "年"
        },
        {
          timeIntervalValue: "月",
          timeIntervalLabel: "月"
        },
        {
          timeIntervalValue: "日",
          timeIntervalLabel: "日"
        }
      ],
      timeIntervalValue: "日",
      waterTypeList: [
        { label: "全部", value: "10" },
        { label: "普通灌溉区", value: "1" },
        { label: "智能灌溉区", value: "2" }
      ],
      value: "10",
      selectYearList: [
        { value: "2019", label: "2019" },
        { value: "2020", label: "2020" }
      ],
      selectMonthList: [
        { value1: "01", label: "01" },
        { value1: "02", label: "02" },
        { value1: "03", label: "03" },
        { value1: "04", label: "04" },
        { value1: "05", label: "05" },
        { value1: "06", label: "06" },
        { value1: "07", label: "07" },
        { value1: "08", label: "08" },
        { value1: "09", label: "09" },
        { value1: "10", label: "10" },
        { value1: "11", label: "11" },
        { value1: "12", label: "12" }
      ],
      selectDayList: [
        { value2: "01", label: "01" },
        { value2: "02", label: "02" },
        { value2: "03", label: "03" },
        { value2: "04", label: "04" },
        { value2: "05", label: "05" },
        { value2: "06", label: "06" },
        { value2: "07", label: "07" },
        { value2: "08", label: "08" },
        { value2: "09", label: "09" },
        { value2: "10", label: "10" },
        { value2: "11", label: "11" },
        { value2: "12", label: "12" },
        { value2: "13", label: "13" },
        { value2: "14", label: "14" },
        { value2: "15", label: "15" },
        { value2: "16", label: "16" },
        { value2: "17", label: "17" },
        { value2: "18", label: "18" },
        { value2: "19", label: "19" },
        { value2: "20", label: "20" },
        { value2: "21", label: "21" },
        { value2: "22", label: "22" },
        { value2: "23", label: "23" },
        { value2: "24", label: "24" },
        { value2: "25", label: "25" },
        { value2: "26", label: "26" },
        { value2: "27", label: "27" },
        { value2: "28", label: "28" },
        { value2: "29", label: "29" },
        { value2: "30", label: "30" },
        { value2: "31", label: "31" }
      ],
      selectYear: "2019",
      selectMonth: "06",
      selectDay: "15",
      selectYear1: "2020",
      selectMonth1: "02",
      selectDay1: "12",
      selectWarnYear1: "2019",
      selectWarnMonth1: "11",
      selectWarnDay1: "11",
      deviceOptions: [
        {
          deviceValue: "监测点1",
          deviceLabel: "监测点1"
        },
        {
          deviceValue: "监测点2",
          deviceLabel: "监测点2"
        }
      ],
      deviceValue: "监测点1",
      soilOption: [
        {
          soilDeviceValue: "监测点1",
          soilDeviceLabel: "监测点1"
        }
      ],
      soilDeviceValue: "",
      zhi: "0",
      pu: "0",
      zhiPro: "0",
      puPro: "0",
      irrList: [],
      thisNum1: "0",
      thisNum2: "0",
      thisNum3: "0",
      economize3: "0",
      money3: "0",
      markers: [],
      total: "0",
      lastMonth: "0",
      economizeWater: "0",
      economizeMoney: "0",
      irrGroupId: "",
      waterStartChartData: [],
      waterStartCreatTime: [],
      waterStartTypeNum: [],
      waterEndChartData: [],
      waterEndCreatTime: [],
      waterEndTypeNum: [],
      soilData: [],
      wateringNum: "",
      wateringTime: "",
      soilMoisture: "",
      riseRatio: "",
      createTime: "",
      markLocation: [],
      markLocation1: [],
      showFlag: false,
      showFlag1: false,
      loading: true,
      activeName: "first",
      mapOptions: [
        {
          mapValue: "年",
          mapLabel: "年"
        },
        {
          mapValue: "月",
          mapLabel: "月"
        },
        {
          mapValue: "日",
          mapLabel: "日"
        }
      ],
      mapValue: "日",
      mapYear: "2020",
      mapMonth: "03",
      mapDay: "03",
      mapYear1: "2020",
      mapMonth1: "03",
      mapDay1: "05",
      mapDeviceId: "",
      xData: [],
      xMapData: [],
      mapChartData: [],
      mapStartTime: [],
      mapStartNum: [],
      mapStartChartData: [],
      mapEndChartData: [],
      mapEndTime: [],
      mapEndNum: [],
      hintCon: "",
      lampList1: [],
      hintNum: "",
      hintTime: "",
      jobName: "",
      isShowHint: false,
      status: "",
      index: "",
      markers1: [],
      soilList: []
    };
  },
  created() {
    this.getMeter();
    this.getMeter1();
    this.getLamp();
    this.demand();
    this.demand1();
    this.getSoilData();
  },
  methods: {
    handler({ BMap, map }) {
      console.log(BMap, map);
      this.center.lng = 116.678131;
      this.center.lat = 39.993762;
      this.zoom = 22;
      let mapStyle = { style: "midnight" };
      map.setMapStyle(mapStyle);
    },
    getMsg(data) {
      this.irrGroupId = data;
      console.log(this.irrGroupId);
    },
    // 控制子组件显示
    operationShow() {
      this.operation = true;
      this.alarm = false;
    },
    alarmShow() {
      this.operation = false;
      this.alarm = true;
    },
    // 获取所有水表
    getLamp() {
      this.$axios({
        method: "get",
        url: "/irrigation/water/all"
      }).then(res => {
        console.log(res);
        var DeviceIdList = [];
        var deviceList = res.data.data;
        this.irrList = res.data.data;
        this.deviceValue = deviceList[0].deviceId;
        for (var i = 0; i < deviceList.length; i++) {
          DeviceIdList.push({
            deviceValue: deviceList[i].deviceId,
            deviceLabel: deviceList[i].deviceName
          });

          console.log(this.deviceValue);
          this.deviceOptions = [...DeviceIdList];
          this.markers.push({
            lng: deviceList[i].longitude,
            lat: deviceList[i].latitude,
            deviceId: deviceList[i].deviceId,
            status: deviceList[i].status,
            isOPen: deviceList[i].isOPen
          });
          console.log(this.markers);
        }
      });
    },
    // 各项水量使用情况
    getMeter() {
      this.$axios({
        method: "get",
        url: "/irrigation/data/getMeter",
        params: {
          type: "1"
        }
      }).then(res => {
        console.log(res);
        var data = res.data.data[0];
        this.economizeWater = data.economize;
        this.economizeMoney = data.money.toFixed(2);
        this.total = data.thisNum;
        console.log(this.total);
        // console.log(this.economizeMoney);
        // var pu = res.data.data[0];
        // var zhi = res.data.data[1];

        // this.pu = pu.thisNum;
        // this.zhi = zhi.thisNum;

        // this.zhiPro = ((this.zhi / (this.zhi + this.pu)) * 100).toFixed(2);
        // this.puPro = ((this.pu / (this.zhi + this.pu)) * 100).toFixed(2);
        // this.total = pu.thisNum + zhi.thisNum;
        // this.economizeWater = pu.economize + zhi.economize;
        // this.economizeMoney = pu.money + zhi.money;
      });
      this.$axios({
        method: "get",
        url: "/irrigation/data/getMeter",
        params: {
          type: "2"
        }
      }).then(res => {
        console.log(res);
        var data = res.data.data[0];
        this.economize3 = data.economize;
        this.money3 = data.money.toFixed(2);
        // this.total = data.thisNum;
        console.log(this.economize3);
        console.log(this.money3);
      });
    },
    // 上月用水情况
    getMeter1() {
      this.$axios({
        method: "get",
        url: "/irrigation/data/getMeter",
        params: {
          type: "2"
        }
      }).then(res => {
        console.log(res);
        var data1 = res.data.data[0];
        var data2 = res.data.data[0];
        var thisNum1 = data1.thisNum;
        var economize1 = data1.economize;
        var money1 = data1.money;

        var thisNum2 = data2.thisNum;
        var economize2 = data2.economize;
        var money2 = data2.money;

        this.economize3 = economize1 + economize2;
        this.money3 = money1 + money2;
        this.thisNum3 = thisNum1 + thisNum2;
        this.thisNum1 = thisNum1;
        this.thisNum2 = thisNum2;
      });
    },
    demand() {
      var that = this;
      var startTime = "";
      var endTime = "";
      var timeType = "";
      if (that.timeIntervalValue == "日") {
        timeType = 3;
        startTime =
          that.selectYear + "-" + that.selectMonth + "-" + that.selectDay;
        endTime =
          that.selectYear1 + "-" + that.selectMonth1 + "-" + that.selectDay1;
      } else if (that.timeIntervalValue == "月") {
        timeType = 2;
        startTime = that.selectYear + "-" + that.selectMonth;
        endTime = that.selectYear1 + "-" + that.selectMonth1;
      } else if (that.timeIntervalValue == "年") {
        timeType = 1;
        startTime = that.selectYear;
        endTime = that.selectYear1;
      }
      let param = {
        // deviceId: that.deviceValue,
        deviceType: that.value,
        startTime: startTime,
        endTime: endTime,
        timeType: timeType
      };
      console.log(param);
      this.$axios({
        method: "get",
        url: "/irrigation/data/getChart",
        params: param
      }).then(res => {
        console.log(res);
        // 开始
        that.waterStartChartData = res.data.data.list;
        that.waterStartCreatTime = [];
        that.waterStartTypeNum = [];
        for (var i = 0; i < that.waterStartChartData.length; i++) {
          that.waterStartCreatTime[i] = that.waterStartChartData[i].createTime;
          that.waterStartTypeNum[i] = that.waterStartChartData[i].thisNum;
        }

        console.log(that.waterStartCreatTime);
        console.log(that.waterStartTypeNum);
        // 结束
        that.waterEndChartData = res.data.data.contrastList;
        that.waterEndCreatTime = [];
        that.waterEndTypeNum = [];
        for (var j = 0; j < that.waterEndChartData.length; j++) {
          that.waterEndCreatTime[j] = that.waterEndChartData[j].createTime;
          that.waterEndTypeNum[j] = that.waterEndChartData[j].thisNum;
        }
        console.log(that.waterEndCreatTime);
        console.log(that.waterEndTypeNum);
        that.drawChart();
      });
    },
    drawChart() {
      let that = this;
      let myChart = this.$echarts.init(document.getElementById("myChart1"));
      console.log(that.waterStartTypeNum);
      console.log(that.timeIntervalValue);
      if (that.timeIntervalValue == "日") {
        that.xData = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24"
        ];
      } else if (that.timeIntervalValue == "月") {
        that.xData = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31"
        ];
      } else if (that.timeIntervalValue == "年") {
        that.xData = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12"
        ];
      }
      console.log(that.xData);
      var options = {
        grid: {
          y: 10,
          height: 80,
          y2: 20
        },
        xAxis: {
          type: "category",
          data: that.xData,
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            data: that.waterStartTypeNum,
            // data: 0,
            type: "line",
            color: "#00ffff",
            lineStyle: {
              color: "#00ffff"
            }
          },
          {
            data: that.waterEndTypeNum,
            // data: 1,
            type: "line",
            color: "#22ac38",
            lineStyle: {
              color: "#22ac38"
            }
          }
        ]
      };
      try {
        myChart.setOption(options);
      } catch (err) {
        console.log(err);
      }
    },
    // 水表信息
    infoWindowOpen(marker) {
      console.log(marker.deviceId);
      this.mapDeviceId = marker.deviceId;
      this.showFlag = true;
      this.showFlag1 = false;
      console.log(this.showFlag);
      console.log(this.showFlag1);
      this.loading = true;
      if (this.showFlag == true) {
        this.$axios({
          method: "get",
          url: "/irrigation/water/getWaterData",
          params: {
            deviceId: marker.deviceId
          }
        }).then(res => {
          console.log(res);
          this.markLocation = res.data.data;
          console.log(this.markLocation);
          // for (var i = 0; i < this.irrList.length; i++) {
          //   console.log(this.markLocation.deviceId);
          //   if (this.irrList[i].deviceId == this.markLocation.deviceId) {
          //     this.markLocation.lat = this.irrList[i].latitude;
          //     this.markLocation.lng = this.irrList[i].longitude;
          //   }
          // }
        });
      }
    },
    closeDevice(deviceId) {
      this.$axios({
        method: "post",
        url: "/irrigation/water/close",
        params: {
          deviceId
        }
      }).then(res => {
        console.log(res);
        if (res.data.code.data == 0) {
          this.$message({
            message: res.data.data.msg,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.data.msg,
            type: "success"
          });
        }
      });
    },
    openDevice(deviceId) {
      this.$axios({
        method: "post",
        url: "/irrigation/water/open",
        params: {
          deviceId
        }
      }).then(res => {
        console.log(res);
        if (res.data.code.data == 0) {
          this.$message({
            message: res.data.data.msg,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.data.msg,
            type: "success"
          });
        }
      });
    },
    getByGroup(groupId) {
      this.$axios({
        method: "get",
        url: "/irrigation/group/ByGroup",
        params: {
          groupId
        }
      }).then(res => {
        console.log(res);
      });
    },
    demand1() {
      this.$axios({
        method: "get",
        url: "/irrigation/data/getMoisture",
        params: {
          deviceId: 7
        }
      }).then(res => {
        console.log(res);
        this.soilData = res.data.data;
        // this.wateringNum = data.wateringNum;
        // this.wateringTime = data.wateringTime;
        // this.soilMoisture = data.soilMoisture;
        // this.riseRatio = data.riseRatio;
        // this.createTime = data.createTime;
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
      if (tab.index == 1) {
        this.mapDemand();
      }
    },
    mapDemand() {
      var that = this;
      var startTime = "";
      var endTime = "";
      var timeType = "";
      if (that.mapValue == "日") {
        timeType = 3;
        startTime = that.mapYear + "-" + that.mapMonth + "-" + that.mapDay;
        endTime = that.mapYear1 + "-" + that.mapMonth1 + "-" + that.mapDay1;
      } else if (that.mapValue == "月") {
        timeType = 2;
        startTime = that.mapYear + "-" + that.mapMonth;
        endTime = that.mapYear1 + "-" + that.mapMonth1;
      } else if (that.mapValue == "年") {
        timeType = 1;
        startTime = that.mapYear;
        endTime = that.mapYear1;
      }
      console.log(startTime);
      console.log(endTime);
      console.log(that.mapDeviceId);
      let param = {
        startTime: startTime,
        endTime: endTime,
        deviceId: that.mapDeviceId,
        timeType: timeType
      };
      this.$axios({
        method: "get",
        url: "/irrigation/data/getChart",
        params: param
      }).then(res => {
        console.log(res);
        // 开始
        that.waterStartChartData = res.data.data.list;
        that.mapStartTime = [];
        that.mapStartNum = [];
        for (var i = 0; i < that.waterStartChartData.length; i++) {
          that.mapStartTime[i] = that.waterStartChartData[i].createTime;
          that.mapStartNum[i] = that.waterStartChartData[i].thisNum;
        }

        console.log(that.mapStartTime);
        console.log(that.mapStartNum);
        // 结束
        that.waterEndChartData = res.data.data.contrastList;
        that.mapEndTime = [];
        that.mapEndNum = [];
        for (var j = 0; j < that.waterEndChartData.length; j++) {
          that.mapEndTime[j] = that.waterEndChartData[j].createTime;
          that.mapEndNum[j] = that.waterEndChartData[j].thisNum;
        }
        console.log(that.mapEndTime);
        console.log(that.mapEndNum);
        that.mapDrawChart();
      });
    },
    mapDrawChart() {
      let that = this;
      let mapChart = that.$echarts.init(document.getElementById("mapChart"));
      console.log(mapChart);
      if (that.mapValue == "日") {
        that.xMapData = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24"
        ];
      } else if (that.mapValue == "月") {
        that.xMapData = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31"
        ];
      } else if (that.mapValue == "年") {
        that.xMapData = [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12"
        ];
      }
      console.log(that.mapValue);
      console.log(that.xMapData);
      console.log(that.mapStartNum);
      console.log(that.mapEndNum);
      // try {
      //   mapChart.setOption(options);
      // } catch (err) {
      //   console.log(err);
      // }
      var mapOption = {
        grid: {
          y: 10,
          height: 80,
          y2: 20
        },
        xAxis: {
          type: "category",
          data: that.xMapData,
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            data: that.mapStartNum,
            // data: 0,
            type: "line",
            smooth: true,
            color: "#00ffff",
            lineStyle: {
              color: "#00ffff"
            }
          },
          {
            data: that.mapEndNum,
            // data: 1,
            type: "line",
            smooth: true,
            color: "#22ac38",
            lineStyle: {
              color: "#22ac38"
            }
          }
        ]
      };
      try {
        mapChart.setOption(mapOption);
      } catch (err) {
        console.log(err);
      }
    },
    getHint() {
      this.isShowHint = "true";
      this.$axios({
        method: "get",
        url: "/irrigation/strategy/getRunDate"
      }).then(res => {
        console.log(res);
        this.hintCon = res.data.code;
        var data = res.data.data;
        var groupId = "";
        var strategyId = "";
        if (res.data.code == 0) {
          for (var i = 0; i < data.length; i++) {
            this.hintNum = data[i].thisNum;
            this.hintTime = data[i].endHms;
            this.jobName = data[i].jobName;
            groupId = data[i].groupId;
            strategyId = data[i].strategyId;
          }
          this.$axios({
            method: "get",
            url: "/irrigation/group/ByGroup",
            params: {
              groupId
            }
          }).then(res => {
            console.log(res);
            this.lampList1 = res.data.data;
          });

          this.$axios({
            method: "get",
            url: "/irrigation/strategy/getByDis",
            params: {
              strategyId
            }
          }).then(res => {
            console.log(res);
            this.status = res.data.status;
          });
        }
      });
    },
    closeHint() {
      this.isShowHint = false;
      console.log(111);
    },
    // 获取土壤点位
    getSoilData() {
      this.$axios({
        method: "get",
        url: "/irrigation/soil/list"
      }).then(res => {
        console.log(res);
        var DeviceIdList = [];
        var deviceList = res.data.data;
        this.soilList = res.data.data;
        // this.soilOption = res.data.data;
        console.log(this.soilOption);
        for (var i = 0; i < deviceList.length; i++) {
          DeviceIdList.push({
            deviceValue: deviceList[i].deviceId,
            deviceLabel: deviceList[i].name
          });
          console.log(DeviceIdList);
          console.log(deviceList);
          this.soilOption = [...DeviceIdList];
          this.soilDeviceValue = DeviceIdList[0].deviceValue;
          this.markers1.push({
            lng: deviceList[i].longitude,
            lat: deviceList[i].latitude,
            deviceId: deviceList[i].deviceId,
            name: deviceList[i].name,
            status: deviceList[i].status
          });
          console.log(this.markers1);
        }
      });
    },
    // 土壤点位信息
    infoWindowOpen1(marker, name) {
      console.log(111);
      console.log(marker);
      console.log(name);
      this.showFlag = false;
      this.showFlag1 = true;
      this.$axios({
        method: "get",
        url: "/irrigation/soil/getById",
        params: {
          deviceId: marker.deviceId
        }
      }).then(res => {
        console.log(res);
        console.log(this.showFlag);
        console.log(this.showFlag1);
        console.log(this.soilList);
        this.markLocation1 = res.data.data;
        console.log(this.markLocation1);
        // for (var i = 0; i < this.soilList.length; i++) {
        //   console.log(this.markLocation1.deviceId);
        //   if (this.soilList[i].deviceId == this.markLocation1.deviceId) {
        //     this.markLocation1.lat = this.soilList[i].latitude;
        //     this.markLocation1.lng = this.soilList[i].longitude;
        //     this.markLocation1.name = this.soilList[i].name
        //   }
        // }
        // console.log(this.markLocation1 );
      });
    }
  }
};
</script>

<style lang="less" scoped>
.illumination {
  display: flex;
  font-size: 12px;

  /deep/.el-progress-bar {
    width: 93% !important;
  }
  .sel::-webkit-scrollbar {
    display: none;
  }
  .soilData::-webkit-scrollbar {
    display: none;
  }
  .chart {
    width: 99%;
    height: 129px;
    margin-top: 5px;
    padding-top: 10px;
  }
  // 左侧面板
  .leftside {
    width: 350px;
    height: 840px;
    background-image: url("../assets/img/leftPanel.png");
    background-size: 100% 100%;
    position: absolute;
    margin: 10px 0 0 20px;
    color: #fff;
    padding: 10px;
    z-index: 1;

    // 头部标题区域
    .title {
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-bottom: 10px;

      span:nth-child(1) {
        color: #00d7fb;
        font-size: 16px;
      }

      span:nth-child(2) {
        font-size: 12px;
        margin-top: 5px;
      }
    }

    .title::after {
      content: "";
      display: block;
      background: url("../assets/img/bg_36.png") no-repeat;
      background-size: 100%;
      width: 40px;
      height: 20px;
      position: absolute;
      top: 5px;
      left: 135px;
    }

    // 智照明设备数量区域
    .num {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;

      .le {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        text-align: right;
        color: #14d9b1;
        background: url("../assets/img/05.png") no-repeat;
        background-size: 100%;
        width: 150px;
        height: 60px;

        span:nth-child(1) {
          margin-top: 12px;
          margin-right: 10px;
        }

        span:nth-child(2) {
          margin-right: 7px;
        }
      }

      .rig {
        display: flex;
        justify-content: space-between;
        width: 150px;

        div {
          display: flex;
          flex-direction: column;
        }
      }
    }

    // 设备统计数量区域
    .amount {
      display: flex;
      margin-bottom: 20px;

      div {
        display: flex;
        flex-direction: column;

        span {
          width: 80px;
          font-size: 14px;
        }

        span:nth-child(2) {
          width: 137px;
          height: 45px;
          border-bottom: 5px solid;
          margin-top: -40px;
          margin-right: 5px;
        }
      }
    }

    .but {
      font-size: 14px;
      margin-bottom: 20px;

      div:nth-child(2) {
        width: 420px;
        height: 45px;
        border-image: linear-gradient(90deg, #1afe98 50%, white 50%) 1 1;
        border-bottom: 5px solid;
        margin-top: -40px;
      }
    }

    .skyblue {
      border-image: linear-gradient(90deg, #1afe98 50%, white 50%) 1 1;
    }

    .blue {
      border-image: linear-gradient(90deg, #1cdefe 50%, white 50%) 1 1 !important;
    }

    .yellow {
      border-image: linear-gradient(90deg, #fdcd04 50%, white 50%) 1 1 !important;
    }

    // 消耗情况
    .consume {
      font-size: 14px;

      div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
    }

    // 各项路灯使用情况详细
    .light {
      display: flex;
      margin-left: 5px;
      margin-bottom: 15px;

      .name {
        margin-right: 5px;
        font-size: 14px;
        width: 80px;
      }

      div:nth-child(2) {
        flex: 1;
      }
    }

    // 使用趋势
    .screen {
      display: flex;
      font-size: 14px;

      select {
        border: none;
        background: url("../assets/img/dataSele.png") no-repeat;
        background-size: 100%;
        width: 80px;
        color: #fff;

        option {
          color: black;
        }
      }

      div {
        span:nth-child(1) {
          margin-right: 20px;
        }
      }

      div:nth-child(1) {
        margin-right: 100px;
      }
    }
  }

  // 右侧内容
  .topside {
    height: 740px;

    .set {
      position: absolute;
      top: 40px;
      right: 150px;
      opacity: 0.5;
      img {
        width: 50px;
        height: 50px;
      }
    }
    .hintBg {
      background-image: url("../assets/img/tiCon.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: absolute;
      top: 115px;
      right: 50px;
      width: 300px;
      padding: 20px;
      color: #c0bfbf;
      letter-spacing: 2px;
    }
  }
  .botside {
    color: #fff;
    font-size: 14px;
    display: flex;

    .warn {
      width: 340px;
      height: 130px;
      background: url("../assets/img/error.png") no-repeat;
      background-size: 100%;
      display: flex;
      flex-direction: column;

      span {
        margin-top: 7px;
        margin-left: 15px;
      }

      span:nth-child(1) {
        margin-top: 20px;
        width: 50px;
        text-align: center;
        background: url("../assets/img/err.png") no-repeat;
        background-size: 100%;
      }
    }
  }
}
</style>
