
window.onload = function () {
    //Initiate Variables for the charts
    const depts = document.querySelectorAll('.dept');
    const roles = document.querySelectorAll('.roler');
    const users = document.querySelectorAll('.user');

    //Build the datapoint object for the 3 charts
    function dataPoints(items) {
        let i = 0;
        let datapoints = [];
        for (item of items) {
            i += 10
            datapoints.push({ x: i, y: parseInt(item.getAttribute('data-title')), indexLabel: `${item.getAttribute('data-name')} (${item.getAttribute('data-title')})` })
        }
        return datapoints;
    }
    const datapoints = dataPoints(depts);
    const datapoints2 = dataPoints(roles)
    const datapoints3 = dataPoints(users);


    //Draw the charts
    var chart1 = new CanvasJS.Chart("chartContainer1", {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", // "light1", "light2", "dark1", "dark2"
        title: {
            text: ""
        },
        axisY: {
            includeZero: true
        },
        data: [{
            type: "column", //change type to bar, line, area, pie, etc
            //indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            indexLabelFontSize: 16,
            indexLabelPlacement: "outside",
            dataPoints: datapoints
        }]
    });
    chart1.render();

    var chart2 = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", // "light1", "light2", "dark1", "dark2"
        title: {
            text: ""
        },
        axisY: {
            includeZero: true
        },
        data: [{
            type: "column", //change type to bar, line, area, pie, etc
            //indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            indexLabelFontSize: 16,
            indexLabelPlacement: "outside",
            dataPoints: datapoints2
        }]
    });
    chart2.render();

    var chart3 = new CanvasJS.Chart("chartContainer3", {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light1", // "light1", "light2", "dark1", "dark2"
        title: {
            text: ""
        },
        axisY: {
            includeZero: true
        },
        data: [{
            type: "column", //change type to bar, line, area, pie, etc
            //indexLabel: "{y}", //Shows y value on all Data Points
            indexLabelFontColor: "#5A5757",
            indexLabelFontSize: 16,
            indexLabelPlacement: "outside",
            dataPoints: datapoints3
        }]
    });
    chart3.render();

}
$('.logout').removeClass('d-none');