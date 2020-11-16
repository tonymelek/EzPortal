

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

function refreshToken() {
    $.get(`api/refreshtoken/${localStorage.getItem('ezPortal')}`).then(res => {
        localStorage.setItem(`ezPortal`, res.token);
    })
}



// // $(document).on("click", '#signin', (e) => {
// //     e.preventDefault();
// //     console.log('hfjdshfkjds');
// //     $.post({
// //         url: '/api/login',
// //         data: {
// //             "email": $('#email').val().trim(),
// //             "password": $('#password').val().trim()
// //         }
// //     }).then(res => {
// //         console.log(res);
// //         // localStorage.setItem(`ezPortal`, res.token);
// //         // location.href = `/lander/${localStorage.getItem('ezPortal')}`
// //     })

// // setInterval(refreshToken, 840000)
// // })

// $('#x').submit((e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     console.log('I came here');
//     // $.post({
//     //     url: '/api/createdept',
//     //     data: {
//     //         "name": $('#new-entry').val()
//     //     },
//     //     headers: {
//     //         'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
//     //     }
//     // })
//     // location.href = `/lander/${localStorage.getItem('ezPortal')}`
// });