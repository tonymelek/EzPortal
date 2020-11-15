
let days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let tasksCompleted = [2, 4, 6, 1, 3, 13, 8, 10, 12, 14];


new Chart(document.getElementById("myChart"), {
    type: "line",
    data: {
        labels: days,
        datasets: [{
            data: tasksCompleted,
            label: "Tasks Completed",
            borderColor: "#3e95cd",
            fill: false
        }
        ]
    }
});



$('#signin').click((e) => {
    e.preventDefault();
    $.post({
        url: '/api/login',
        data: {
            "email": $('#email').val(),
            "password": $('#password').val()
        }
    }).then(res => {
        console.log(res);
        localStorage.setItem(`ezPortal`, res.token);
        location.href = `/lander/${res.token}`
    })
})