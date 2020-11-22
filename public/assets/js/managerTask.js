let toEdit;
//Delete pre-defined Task
$('.deleteTask').click(function () {
    $.ajax({
        type: 'delete',
        url: '../api/delete-pre-task',
        headers: { 'Authorization': `bearer ${localStorage.getItem('ezPortal')}` },
        data: {
            id: this.id.split('-')[1]
        }
    }).then((result) => $(this).hide())
})
//Display details of task to be editted
$('.editTask').click(function () {
    toEdit = this.id.split('-')[1];
    $('#modal-task-desc').val($(this).data('modalb'))
    $('#modal-task-name').val($(this).data('modalt'))
    if (document.querySelector('#update-btn').classList.length == 2) {
        $('#update-btn').addClass('update')
    }
})
//Update Task
$('#edit-task').submit((e) => {
    e.preventDefault();
    if (document.querySelector('#update-btn').classList.length == 3) {
        $.ajax({
            type: 'put',
            url: '../api/update-pre-task',
            headers: { 'Authorization': `bearer ${localStorage.getItem('ezPortal')}` },
            data: {
                id: toEdit,
                title: $('#modal-task-name').val().trim(),
                body: $('#modal-task-desc').val().trim()
            }
        }).then((result) => location.reload())
    }

})
//Add new pre-Defined Task
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
//Assign Task 
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
//Approve a complete Task
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
//Complete a task
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