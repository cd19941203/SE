function addDays(startDate, numberOfDays) {
    var returnDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + numberOfDays,
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds());
    return returnDate;
}

function init() {
    
}

async function submit()
{
    var label = [];
    var amount = [];
    var color = [];
    var begin = document.getElementById("beginTime").value;
    var end = document.getElementById("endTime").value;
    if(begin == "" || end == "")
    {
        swal("錯誤","請輸入時間區間",{icon:"error"});
        return;
    }
    var a = new Date(begin);
    var b = new Date(end);
    if(a > b)
    {
        swal("錯誤","起始時間必須小於結束時間",{icon:"error"});
        return;
    }
    var ctx = document.getElementById('chart').getContext('2d');
    var date = new Date();
    $.ajax({
        url: "/mealAnalyze",
        type: "get",
        data: {
            endTime: end,
            beginTime: begin,
        },
        success: function (data) {
            createChart(data,"Meal Analyze", document.getElementById('chart').getContext('2d'));
        }
    });
    $.ajax({
        url: "/genderAnalyze",
        type: "get",
        data: {
            endTime: end,
            beginTime: begin,
        },
        success: function (data) {
            createChart(data["男"],"Male Order Analyze", document.getElementById('chartMale').getContext('2d'));
            createChart(data["女"],"Female Order Analyze", document.getElementById('chartFemale').getContext('2d'));
        }
    });
    $.ajax({
        url: "/getOrderStatusCount",
        type: "get",
        success: function (data) {
            createChart(data,"Order Analyze", document.getElementById('chartB').getContext('2d'));
        }
    });
    
}

function createChart(data, title, chartDom)
{
    var label = [];
    var amount = [];
    var color = [];
    for (var doc of data) {
        label.push(doc.meal);
        amount.push(doc.amount);
        color.push(getRandomColor());
    }
    var chart = new Chart(chartDom, {
        // The type of chart we want to create
        type: 'bar',

        // The data for our dataset
        data: {
            labels: label,
            datasets: [{
                label: title,
                data: amount,
                backgroundColor: color,
                borderColor: color,
                fill: false
            }],

        },

        // Configuration options go here
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    min: 0
                }]
            }
        }
    });
}

function getRandomColor() {
    var color = 'rgba(';
    for (var i = 0; i < 3; i++) {
        color +=  Math.floor(Math.random() * 255)+',';
    }
    color+='0.2)'
    return color;
}


addEventListener('load', init, false);
