
$(document).ready(function () {
  // Set new default font family and font color to mimic Bootstrap's default styling
  Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  Chart.defaults.global.defaultFontColor = '#292b2c';

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
  Ajax.get(AEnvironment.ANALYTICS_ACTIVITY_URL.replace('{{days}}', 13).replace('{{authtoken}}', getAuthToken()), function (resp) {
    resp = JSON.parse(resp).data;
    console.log('analytics activity', resp);
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

    // Bar Chart Example
    var ctx = document.getElementById("myBarChart");
    var myLineChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "Activity",
          backgroundColor: "rgba(2,117,216,1)",
          borderColor: "rgba(2,117,216,1)",
          data: datas,
        }],
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'month'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 6
            }
          }],
          yAxes: [{
            ticks: {
              min: min,
              max: max,
              maxTicksLimit: 5
            },
            gridLines: {
              display: true
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
      title: 'Could not load analytics activity data!',
      body: err.message || 'Something went wrong!'
    });
  });
});