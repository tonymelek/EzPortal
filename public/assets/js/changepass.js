//Handle Changing Password Check and Logic
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

            if (result.msg == "failed to update, wrong old password") {
                alertify.alert('Password Change Error', 'Wrong Old Password!');
            } else {
                alertify.alert('Password Change Success', 'Password Changed Succesfully', () => location.href('/'))

            }
        })
    } else {
        alertify.alert('Password Change Error', 'Passwords mismatch!');

    }
})