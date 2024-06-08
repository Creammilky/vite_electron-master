<template>
  <div class="dashboard">
    <div class="node-info">
      <h2>节点信息</h2>
      <p><strong>地址：</strong>12D3KooWBr5nabBBXnhZ9jxkVRUXwpBoQQKNLBWsrXcrPay9szBN</p>
      <p><strong>连接状态：</strong>已连接</p>
      <p><strong>上传文件总数：</strong>21</p>
      <p><strong>下载文件总数：</strong>15</p>
    </div>
    <div class="grid">
      <div class="chart-container">
        <canvas id="bandwidthChart"></canvas>
      </div>
      <div class="speeds horizontal">
        <div class="speed">
          <canvas id="uploadSpeedGauge" style="height: 100%;"></canvas>
          <p>上传速度</p>
        </div>
        <div class="speed">
          <canvas id="downloadSpeedGauge"></canvas>
          <p>下载速度</p>
        </div>
      </div>
      <div class="nodes-count full-width">
      <h3>在线节点</h3>
      <table class="peers-table">
        <thead>
          <tr>
            <th>国家</th>
            <th>延迟</th>
            <th>协议</th>
            <th>地址</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="peer in [{ id: 1, country: 'China', latency: '69ms', protocol: 'ip4 • tcp', address: 'QmPmk2mrPULfAdjsywDLPFrBcYboJuoCijDT8iFbEiqKew' },
{ id: 2, country: 'China', latency: '71ms', protocol: 'ip4 • udp', address: '12D3KooWHHE4dqLog6Fq1tMfLWjVvhcimaqPHAYmexa8w4JER4Fh' },
{ id: 3, country: 'China', latency: '55ms', protocol: 'ip6 • udp', address: '12D3KooWBr5nabBBXnhZ9jxkVRUXwpBoQQKNLBWsrXcrPay9szBN' },
{ id: 3, country: 'China', latency: '75ms', protocol: 'ip6 • tcp', address: '12D3KooWMy1cRE4tCLarRs37jALSVtdxnfkpjXJHiaAZgRW1dqd7' }]" :key="peer.id">
            <td>{{ peer.country }}</td>
            <td>{{ peer.latency }}</td>
            <td>{{ peer.protocol }}</td>
            <td>{{ peer.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  background: #1e1e2f; /* Dark blue background for a tech feel */
  border: 2px solid #1e1e2f; /* Adds a white border */
  padding-left: 20px; /* Adds padding to the left side */
}

.node-info {
  width: 100%;
  text-align: left; /* Align text to the left */
  padding: 20px;
  border-bottom: 2px solid #333;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  padding: 20px;
}

.chart-container, .metrics, .nodes-count, .speeds {
  background: #23234e; /* Slightly lighter blue for contrast */
  padding: 20px;
  border-radius: 8px;
  height: 250px; /* Fixed height for consistent display */
}

.horizontal {
  display: flex;
  justify-content: space-around;
}

.speed {
  flex: 1; /* Equal width for each speed gauge */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric canvas, .speed canvas {
  margin-top: 40px;
  max-height: 250px; /* Limit canvas size to fit within the grid area */
}

.nodes-count.full-width {
  grid-column: 1 / -1; /* Make it span the full width */
}

.peers-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  color: #fff;
}

.peers-table th, .peers-table td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #fff; /* Adds a white border for separation */
}

.peers-table th {
  background: #36454f; /* Darker shade for header */
}

</style>



<script setup>
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js';
import { Gauge } from 'gaugeJS';
import { random } from 'lodash';


Chart.register(...registerables);

onMounted(() => {
  let chartData = {
  labels: Array.from({ length: 60 }, (_, i) => `${i}Min`),
  datasets: [{
    label: '上传带宽',
    data: Array.from({ length: 60 }, () => Math.floor(Math.random() * 200 + 50)),
    fill: true,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgb(0, 191, 255)'
  }, {
    label: '下载带宽',
    data: Array.from({ length: 60 }, () => Math.floor(Math.random() * 200 + 50)),
    fill: true,
    backgroundColor: 'rgb(4, 61, 110)',
    borderColor: 'rgb(9, 236, 233)'
  }]
};
  createBandwidthChart(chartData);
  let uploadSpeed = Math.random() * 5;
  let downloadSpeed = Math.random() * 15;
  initGauge('uploadSpeedGauge', uploadSpeed, '上传速度(Mb/s)', 50, ['#00bfff', '#007fff']); // 使用冷色调
  initGauge('downloadSpeedGauge', downloadSpeed, '下载速度(Mb/s)', 100, ['#93f5e9', '#09ece9']); // 使用暖色调
  // intervalId = setInterval(() => {
  //   let uploadSpeed = Math.random() * 10;
  //   let downloadSpeed = Math.random() * 10;
  //   initGauge('uploadSpeedGauge', uploadSpeed, '上传速度(Mb/s)', 50, ['#00bfff', '#007fff']); // 使用冷色调
  //   initGauge('downloadSpeedGauge', downloadSpeed, '下载速度(Mb/s)', 50, ['#93f5e9', '#09ece9']); // 使用暖色调
  //   console.log(uploadSpeed);
  // }, 5000);
});

function createBandwidthChart(data) {
  const ctx = document.getElementById('bandwidthChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      maintainAspectRatio: false
    }
  });
}


function initGauge(canvasId, value, label, max, colors) {
  const target = document.getElementById(canvasId);
  if (!target) {
    console.error('Canvas element not found:', canvasId);
    return;
  }
  const gauge = new Gauge(target).setOptions({
    angle: 0,
    lineWidth: 0.2,
    radiusScale: 1,
    pointer: {
      length: 0.6,
      strokeWidth: 0.035,
      color: colors[0]
    },
    limitMax: false,
    percentColors: [[0.0, colors[0]], [0.50, colors[1]], [1.0, colors[1]]],
    strokeColor: '#E0E0E0',
    generateGradient: true,
    highDpiSupport: true,
    staticZones: [
      { strokeStyle: colors[0], min: 0, max: max * 0.3 },
      { strokeStyle: colors[1], min: max * 0.3, max: max * 0.7 },
      { strokeStyle: colors[1], min: max * 0.7, max: max }
    ],
    staticLabels: {
      font: "12px sans-serif",
      labels: [0, max * 0.3, max * 0.7, max],
      color: "#FFFFFF",
      fractionDigits: 0
    }
  });
  gauge.maxValue = max;
  gauge.setMinValue(0);
  gauge.animationSpeed = 32;
  gauge.set(value);
}

</script>
