localStorage.setItem("ezPortal", '{{token.token}}')
$('#change-pass').submit((e) => {
    e.preventDefault();
    if ($('#new1').val() === $('#new2').val()) {
        $.ajax({
            type: 'put',
            url: `../api/changepass`,
            headers: {
                'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
            },
            data: {
                password: $('#new1').val(),
                old_pass: $('#old').val()

            }
        }).then((result) => {
            console.log(result)
            location.reload()
        })
    } else {
        alertify.alert('Passwords mismatch!');

    }
})
$(document).on("click", ".completed", function (e) {
    e.preventDefault();
    const toComplete = this.id.split('-')[1]
    console.log(toComplete)
    $.ajax({
        type: 'put',
        url: `../api/complete-task`,
        headers: {
            'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
        },
        data: {
            task_id: toComplete

        }
    }).then((result) => {
        console.log(result)
        location.reload()
    })
})

