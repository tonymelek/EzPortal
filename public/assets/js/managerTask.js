
$('#add-task').submit((e) => {
    e.preventDefault();
    $.post({
        url: `../api/create-pretask`,
        headers: {
            'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
        },
        data: {
            title: $('#task-name').val().trim(),
            body: $('#task-desc').val().trim()

        }
    }).then(() => location.reload())
})
$('#assign-task').submit((e) => {
    e.preventDefault();
    $.post({
        url: `../api/assign-task`,
        headers: {
            'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
        },
        data: {
            assignedto: $('#assign-to').val(),
            preid: $('#pre-task').val()

        }
    }).then(() => location.reload())
})
$(document).on("click", ".approve", function (e) {
    e.preventDefault();
    const toComplete = this.id.split('-')[1]
    $.ajax({
        type: 'put',
        url: `../api/approve-task`,
        headers: {
            'Authorization': `bearer ${localStorage.getItem('ezPortal')}`
        },
        data: {
            task_id: toComplete

        }
    }).then((result) => {
        location.reload()
    })
})
$(document).on("click", ".completed", function (e) {
    e.preventDefault();
    const toComplete = this.id.split('-')[1]
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
        location.reload()
    })
});