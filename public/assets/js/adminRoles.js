
let toEdit;
$('#new-role').submit((e) => {
    e.preventDefault();
    if (document.querySelector('#submit').classList.length > 2) {
        $.ajax({
            type: 'put',
            url: `../api/updaterole`,
            headers: {
                'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
            },
            data: {
                id: toEdit,
                title: $('#inputTitle').val().trim(),
                wage: parseInt($('#inputRate').val()),
                level: parseInt($('#inputManagement').val()),
                deptid: parseInt($('#inputDepartment').val())
            }
        }).then(() => location.reload())
        $('#submit').removeClass('update');
        return
    }
    $.post({
        url: '/api/createrole',
        headers: {
            'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
        },
        data: {
            title: $('#inputTitle').val().trim(),
            wage: parseInt($('#inputRate').val()),
            level: parseInt($('#inputManagement').val()),
            deptid: parseInt($('#inputDepartment').val())
        }
    }).then(res => location.reload())
})
$(document).on("click", ".delete", function (e) {
    e.preventDefault();
    const toDelete = this.id.split('-')[1]
    $.ajax({
        type: 'delete',
        url: `../api/deleterole`,
        headers: {
            'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
        },
        data: {
            id: toDelete
        }
    }).then(() => location.reload())

})
$(document).on("click", ".edit", function (e) {
    e.preventDefault();
    if (document.querySelector('#submit').classList.length == 2) {
        $('#submit').addClass('update');
    }
    toEdit = this.id.split('-')[1]
    $('#inputTitle').val($(`#role-${toEdit}`).text().trim())
    $('#inputRate').val(($(`#role-${toEdit}`).attr('data-rate')))
    $('#inputManagement').val(($(`#role-${toEdit}`).attr('data-level')))
    $('#inputDepartment').val(($(`#role-${toEdit}`).attr('data-dept')))
});
function refreshToken() {
    $.get(`api/refreshtoken/${localStorage.getItem('ezPortal')}`).then(res => {
        localStorage.setItem(`ezPortal`, res.token);
    })
}