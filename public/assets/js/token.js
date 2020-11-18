
function refreshToken() {
    $.get(`api/refreshtoken/${localStorage.getItem('ezPortal')}`).then(res => {
        localStorage.setItem(`ezPortal`, res.token);
    })
}

setInterval(refreshToken, 840000)

