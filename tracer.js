/*
 * Copyright 2022 Vice Dev
 * Released under the MIT license
 *
 */

function startRefreshTimer(timerValue) {
  if (timerValue > 0) {
    apiTimer = setInterval(timerFunc, timerValue * 1000);
  } else {
    window.alert("Timer value should be greater than 0!");
  }
}

var refreshCount = 0;
function timerFunc() {
  parseData(document.getElementById("traceDataSource").value.trim());
  refreshCount++;
  document.getElementById("refreshStartBtn").innerHTML =
    "Refreshed - " + refreshCount + " times.";
  document.getElementById("refreshStartBtn").disabled = true;
}

function stopRefreshTimer() {
  clearInterval(apiTimer);
  refreshCount = 0;
  document.getElementById("refreshStartBtn").innerHTML = "Start Refresh";
  document.getElementById("refreshStartBtn").disabled = false;
}

var apiTimer = "";
var data = [];
function parseData(inputData) {
  if (inputData != undefined && undefined != "") {
    try {
      var url = new URL(inputData);
      $.ajax({
        type: "GET",
        url: url.href,
        dataType: "text",
        success: function (response) {
          init(response);
        },
        error: function () {
          window.alert("error while getting data");
        },
      });
    } catch (_) {
      init(inputData);
    }
  }
}

$(function () {
  $("#slider-range").slider({
    range: true,
    min: from,
    max: till,
    values: [from, till],
    slide: function (event, ui) {
      $("#amount").val(ui.values[0] + "% - " + ui.values[1] + "%");
      var tempData = {};
      Object.keys(data).forEach(function (key, index) {
        from = parseInt((data[key].length * parseInt(ui.values[0])) / 100);
        till = parseInt((data[key].length * parseInt(ui.values[1])) / 100);
        tempData[key] = data[key].slice(parseInt(from), parseInt(till + 1));
      });
      showChart(tempData, document.getElementById("api").value);
    },
  });
  $("#amount").val(
    $("#slider-range").slider("values", 0) +
      "% - " +
      $("#slider-range").slider("values", 1) +
      "%"
  );
});

var from = 0;
var till = 100;
var apiSelected = "";
var apiSelectedIndex = 0;
function init(resp) {
  data = [];
  try {
    data = JSON.parse(resp);
  } catch (error) {
    console.log("Invalid data source!");
  }
  //initialize drop downs
  var drops = document.getElementById("api");
  drops.innerHTML = "";
  var tempData = {};
  Object.keys(data).forEach(function (key, index) {
    drops.innerHTML += '<option value="' + key + '">' + key + "</option>";
    tempData[key] = data[key].slice(from, till + 1);
  });
  document.getElementById("api").selectedIndex = apiSelectedIndex;
  if (apiSelected == "") {
    apiSelected = Object.keys(tempData)[0];
  }
  showChart(tempData, apiSelected);
}

var chartColors = {};
function showChart(apiData, api) {
  apiSelected = api;
  apiSelectedIndex = document.getElementById("api").selectedIndex;
  var dataSets = [];
  Object.keys(apiData[api][0]).forEach(function (key, index) {
    var chartData = [];
    for (var i = 0; i < apiData[api].length; i++) {
      apiData[api][i] = Object.keys(apiData[api][i])
        .sort()
        .reduce((obj, key) => {
          obj[key] = apiData[api][i][key];
          return obj;
        }, {});
      var item = {
        x: i,
        y: new Date(apiData[api][i][key]).getTime(),
      };
      chartData.push(item);
    }
    if (chartColors[key] == undefined || chartColors[key] == "") {
      chartColors[key] = getRandomDarkColor();
    }
    var d = {
      label: key,
      data: chartData,
      backgroundColor: chartColors[key],
    };
    dataSets.push(d);
  });
  if (window.bar != undefined) window.bar.destroy();
  var ctx = document.getElementById("myChart").getContext("2d");
  var options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Timestamp",
          },
          //  gridLines: {
          //    color: "grey"
          //  },
          ticks: {
            fontColor: "black",
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Trace Sample",
          },
          //  gridLines: {
          //    color: "grey"
          //  },
          ticks: {
            fontColor: "black",
          },
        },
      ],
    },
  };
  window.bar = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: dataSets,
    },
    options: options,
  });
  window.bar.data.datasets = dataSets;
  window.bar.update();
}

function getRandomDarkColor() {
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 10);
  }
  return color;
}

function downloadSampleTraceJSON(exportObj, exportName) {
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

var testData = {};
function test() {
  var init = 892668600000;
  var maxOut = getRandomInt(10, 20);
  var maxIn = 0;
  var formSubmissionApi = [];
  for (let j = 0; j < maxOut; j++) {
    maxIn = getRandomInt(5, 15);
    for (let i = 0; i < maxIn; i++) {
      var t = {};
      t["a-inside_form_submit_function"] = init;
      t["b-time_to_validate_form_data"] =
        t["a-inside_form_submit_function"] + getRandomInt(1, 2);
      t["c-time_to_insert_in_database"] =
        t["b-time_to_validate_form_data"] + getRandomInt(6, 11);
      t["d-time_to_update_cache"] =
        t["c-time_to_insert_in_database"] + getRandomInt(0, 1);
      t["e-time_to_send_notification"] =
        t["d-time_to_update_cache"] + getRandomInt(1, 2);
      formSubmissionApi.push(t);
    }
    ran = getRandomInt(0, 3);
    init += ran;
  }
  testData["form_submission_api"] = formSubmissionApi;

  init = 892668600000;
  maxOut = getRandomInt(10, 20);
  maxIn = 0;
  var fileUploadApi = [];
  for (let j = 0; j < maxOut; j++) {
    maxIn = getRandomInt(5, 15);
    for (let i = 0; i < maxIn; i++) {
      var t = {};
      t["a-inside_file_upload_function"] = init;
      t["b-time_to_validate_file"] =
        t["a-inside_file_upload_function"] + getRandomInt(0, 2);
      t["c-time_to_insert_file_into_file_storage"] =
        t["b-time_to_validate_file"] + getRandomInt(100, 200);
      fileUploadApi.push(t);
    }
    ran = getRandomInt(3, 10);
    init += ran;
  }
  testData["file_upload_api"] = fileUploadApi;
  document.getElementById("traceDataSource").value = JSON.stringify(testData);
  parseData(JSON.stringify(testData));
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
