
window.onload = function () {
    const depts = document.querySelectorAll('.dept');
    const roles = document.querySelectorAll('.roler');
    const users = document.querySelectorAll('.user');
    const datapoints = []
    const datapoints2 = []
    const datapoints3 = []
    let i = 0;
    for (item of depts) {
        i += 10
        datapoints.push({ x: i, y: parseInt(item.getAttribute('data-title')), indexLabel: `${item.getAttribute('data-name')} (${item.getAttribute('data-title')})` })
    }
    i = 0
    for (item of roles) {
        i += 10
        datapoints2.push({ x: i, y: parseInt(item.getAttribute('data-title')), indexLabel: `${item.getAttribute('data-name')} (${item.getAttribute('data-title')})` })
    }
    i = 0
    for (item of users) {
        i += 10
        datapoints3.push({ x: i, y: parseInt(item.getAttribute('data-title')), indexLabel: `${item.getAttribute('data-name')} (${item.getAttribute('data-title')})` })
    }

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