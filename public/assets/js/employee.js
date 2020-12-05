//Hadle Task Completion
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
})
$('.logout').removeClass('d-none');
