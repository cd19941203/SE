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
    var ctx = document.getElementById('chart').getContext('2d');
    var date = new Date();
    $.ajax({
        url: "/mealAnalyze",
        type: "get",
        data: {
            endTime: date.toISOString(),
            beginTime: addDays(date, -30).toISOString(),
        },
        success: function (data) {
            var label = [];
            var amount = [];
            var color = [];
            for (var doc of data) {
                label.push(doc.meal);
                amount.push(doc.amount);
                color.push(getRandomColor());
            }
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'bar',

                // The data for our dataset
                data: {
                    labels: label,
                    datasets: [{
                        label: "Meal Analyze",
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
    });
    /*var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5, 2, 20, 30, 45],
            }]
        },

        // Configuration options go here
        options: {}
    });*/
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
