

$(document).ready(function () {
  // Set new default font family and font color to mimic Bootstrap's default styling
  if (typeof Chart === "undefined") {
    return;
  }

  Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#292b2c';

  var ctx = document.getElementById("myAreaChart");

  var months = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dev',
  };

  Ajax.get(AEnvironment.ANALYTICS_VISITORS_URL.replace('{{days}}', 13).replace('{{authtoken}}', getAuthToken()), function (resp) {
    resp = JSON.parse(resp).data;
    console.log('analytics visitors', resp);
    var labels = [];
    var datas = [];
    var max = 0;
    var min = 0;

    for (var key in resp) {
      if (resp.hasOwnProperty(key)) {
        labels.push(months[key.split('/')[1]] + ' ' + key.split('/')[2]);
        datas.push(resp[key]);
        if (max < resp[key]) {
          max = resp[key];
        }
      }
    }

    max = max + (10 - (max % 10));

    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: "Visitors",
          lineTension: 0.3,
          backgroundColor: "rgba(2,117,216,0.2)",
          borderColor: "rgba(2,117,216,1)",
          pointRadius: 5,
          pointBackgroundColor: "rgba(2,117,216,1)",
          pointBorderColor: "rgba(255,255,255,0.8)",
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(2,117,216,1)",
          pointHitRadius: 50,
          pointBorderWidth: 2,
          data: datas,
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              min: min,
              max: max,
              maxTicksLimit: 5
            },
            gridLines: {
              color: "rgba(0, 0, 0, .125)",
            }
          }],
        },
        legend: {
          display: false
        }
      }
    });
  }, function (err) {
    err = JSON.parse(err);
    showToastMessage({
      title: 'Could not load analytics visitors data!',
      body: err.message || 'Something went wrong!'
    });
  });
});
