//Handle Complete Task
$(document).on("click", ".completed", function (e) {
    e.preventDefault();
    const toComplete = this.id.split('-')[1]
    console.log(toComplete)
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
        console.log(result)
        location.reload()
    })
})