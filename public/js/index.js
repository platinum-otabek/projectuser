$(document).ready(()=>{
    $('.delete-book').on('click',(e)=>{
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: "DELETE",
            url:'/book/' + id,
            success:(response)=>{
                alert('Kitob o`chirildi'),
                window.location.href='/'
            },
            error: (err)=>{
                console.log(err);
            }
        });
    })
});