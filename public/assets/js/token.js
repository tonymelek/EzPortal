//Refresh token while the browser is open
function refreshToken() {
    $.get(`api/refreshtoken/${localStorage.getItem('ezPortal')}`).then(res => {
        localStorage.setItem(`ezPortal`, res.token);
    })
}
//Refresh the browser every 14 min.
setInterval(refreshToken, 840000)

