
let toEdit;
$('#new-user').submit((e) => {

    e.preventDefault();
    if (document.querySelector('#submit').classList.length > 2) {
        $.ajax({
            type: 'put',
            url: `../api/updateuser`,
            headers: {
                'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
            },
            data: {
                id: toEdit,
                f_name: $('#inputFirstName').val().trim(),
                l_name: $('#inputLastName').val().trim(),
                email: $('#inputEmail').val().trim(),
                mob: parseInt($('#inputMobile').val()),
                off: parseInt($('#inputOfficeNumber').val()),
                rolid: $('#inputRole').val().trim()
            }
        }).then(() => location.reload())
        $('#submit').removeClass('update');
        return
    }
    $.post({
        url: '/api/createuser',
        headers: {
            'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
        },
        data: {
            f_name: $('#inputFirstName').val().trim(),
            l_name: $('#inputLastName').val().trim(),
            email: $('#inputEmail').val().trim(),
            mob: parseInt($('#inputMobile').val()),
            off: parseInt($('#inputOfficeNumber').val()),
            rolid: $('#inputRole').val().trim()

        }
    }).then(res => location.reload())
})
$(document).on("click", ".delete", function (e) {
    e.preventDefault();
    const toDelete = this.id.split('-')[1]
    $.ajax({
        type: 'delete',
        url: `../api/deleteuser/${toDelete}`,
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
    $('#inputFirstName').val(($(`#user-${toEdit}`).attr('data-f_name')))
    $('#inputLastName').val(($(`#user-${toEdit}`).attr('data-l_name')))
    $('#inputEmail').val(($(`#user-${toEdit}`).attr('data-email')))
    $('#inputMobile').val(($(`#user-${toEdit}`).attr('data-mob')))
    $('#inputOfficeNumber').val(($(`#user-${toEdit}`).attr('data-off')))
    $('#inputRole').val(($(`#user-${toEdit}`).attr('data-rolid')))
});


