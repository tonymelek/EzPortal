
let toEdit;
$('#new-dept').submit((e) => {

    e.preventDefault();
    if (document.querySelector('#submit').classList.length > 2) {
        $.ajax({
            type: 'put',
            url: `../api/updatedept`,
            headers: {
                'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
            },
            data: {
                id: toEdit,
                name: $('#inputDepartmentName').val().trim()
            }
        }).then(() => location.reload())
        $('#submit').removeClass('update');
        return
    }
    $.post({
        url: '/api/createdept',
        headers: {
            'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
        },
        data: {
            name: $('#inputDepartmentName').val().trim()
        }
    }).then(res => location.reload())
})
$(document).on("click", ".delete", function (e) {
    e.preventDefault();
    const toDelete = this.id.split('-')[1]
    $.ajax({
        type: 'delete',
        url: `../api/deletedept`,
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
    $('#inputDepartmentName').val($(`#dept-${toEdit}`).text().trim())
});
