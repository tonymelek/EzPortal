$('#login-form').submit(function (e) {
    e.preventDefault();
    $.post({
        url: 'api/login',
        data: {
            email: $('#email').val().trim(),
            password: $('#password').val()
        }
    }).then(function (result) {
        if (result.level == undefined) {

            alertify.alert('Login Error', 'Wrong email or password, Please,try again');
            return
        }
        localStorage.setItem('ezPortal', result.token.token) //Store the token into local storage
        //Redirect depending on management level
        switch (result.level) {
            case 100:
                location.href = (`/admin-home/${result.token.token}`)
                break;
            case 2:
                location.href = (`/manager-home/${result.token.token}`)
                break;
            case 1:
                location.href = (`/user-home/${result.token.token}`)
                break;
            default:
                break;
        }
    })
})

$('.logout').addClass('d-none');