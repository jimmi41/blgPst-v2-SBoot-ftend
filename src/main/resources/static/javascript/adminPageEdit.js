const urlParams = new URLSearchParams(window.location.search);
const clickedPostId = urlParams.get('postId');
let clickedPostData = null;

if(clickedPostId!==null)
{
    //removing the add form
    const addForm = document.getElementById("addNewPostForm");
    addForm.remove();
    //clickedPostId !== null means we are updataing existing post.
    fetchOnePost()
        .then(fillRenderDetail)
        .catch(error => {
        console.error('Error filling render detail post in admin page edit .js:', error);
    });
}
else
{
    //clickedPostId === null means we are adding new post.
    const editStringElement = document.getElementById("editString");
    editStringElement.textContent = "Add New Blog Post";

    //Now i will be removing the edit form and delete form and we will use the add form
    const editForm = document.getElementById("updateForm");
    editForm.remove();

    const deletePostForm = document.getElementById("deletePostForm");
    deletePostForm.remove();

    //just setting the date field as todays date
    const dateToday = new Date().toJSON().slice(0,10);
    const dateField = document.getElementById("date");
    dateField.value=dateToday;

}



async function fetchOnePost() {
    try {
        let post;
        if (typeof window === 'undefined')
        {
            const apiUrl = 'http://localhost:8080';
            post = await fetch(`${apiUrl}/myBlog/getOnePost/${clickedPostId}`);
        } else
        {
            //          const appUrl = process.env.API_URL; ////in railway i will directly define apiUrl
            const apiUrl = 'https://blgpst-v2-sboot-ftend-production.up.railway.app';
            post = await fetch(`${apiUrl}/myBlog/getOnePost/${clickedPostId}`);
//            post = await fetch(`https://blgpst-v2-sboot-ftend-production.up.railway.app/myBlog/getOnePost/${clickedPostId}`);
        }
        if(post.ok===false)
        {
            //this meanse we are accessign some post which is deleted or doesn't exist
            window.location.href =`/adminPage` ;
        }
        else
        {
            const fetchedPost = await post.json();
            clickedPostData = fetchedPost; // Store fetched post in the global variable
        }

    } catch (error) {
        console.error('Error fetching post in admin page edit.js ', error);
    }
}
function fillRenderDetail() {

    const title = document.getElementById('title');
    title.value = clickedPostData.title;

    const subtitle = document.getElementById('subtitle');
    subtitle.value = clickedPostData.subtitle;

    const postData = document.getElementById('story');
    postData.value = clickedPostData.postData;

    const dateOfPost = document.getElementById('date');
    dateOfPost.value = clickedPostData.dateOfPost;


    const image = document.getElementById('image');
    image.value = clickedPostData.imageUrl;

    if(image.src == null)
    {
        image.src = "/images/bilkhet.jpg";
    }
    image.onerror = () => {
        image.src = "/images/bilkhet.jpg";
    }
    //    const formAction = document.getElementById('updateForm');
    //    formAction.action = `/update/${clickedPostId}`;
}
function onUpdatePost(form){
    const formData = new FormData(form);
    event.preventDefault();
    console.log("we clicked submit button");
    const apiUrl = `https://blgpst-v2-sboot-ftend-production.up.railway.app/myBlog/update/${clickedPostId}`;

    let requestBody = {};
    // Use FormData to serialize the form data
    requestBody.title = form.elements['title'].value;
    requestBody.subtitle = form.elements['subtitle'].value;
    requestBody.imageUrl = form.elements['image'].value;
    requestBody.postData = form.elements['story'].value;
    requestBody.dateOfPost = form.elements['date'].value;

    requestBody = JSON.stringify(requestBody);


    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            },
        body: requestBody,
    })
        .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        window.location.href =`/adminPage`;
    })
        .catch(error => {
        // Handle errors during the fetch
        console.error('Fetch error:', error);
    });
    // Prevent the default form submission
    return false;
}
function onAddNewPost(form){
    const formData = new FormData(form);
    event.preventDefault();
    console.log("we clicked Add new Post button");
    const apiUrl = `https://blgpst-v2-sboot-ftend-production.up.railway.app/myBlog/add`;

        let requestBody = {};
        // Use FormData to serialize the form data
        requestBody.title = form.elements['title'].value;
        requestBody.subtitle = form.elements['subtitle'].value;
        requestBody.imageUrl = form.elements['image'].value;
        requestBody.postData = form.elements['story'].value;
        requestBody.dateOfPost = form.elements['date'].value;

        requestBody = JSON.stringify(requestBody);

        fetch(apiUrl,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        }).then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! in admin page edit inside on Add new post Status: ${response.status}`);
            }
            return response.json();
        }).then( response =>{
            window.location.href =`/adminPage` ;
            }
        ).catch(error => {
            //errors during the fetch
            console.error('Fetch error:', error);
        });
        return false;
}
function deleteCurrentPost(form){
    //we could have done better instead of using form we could have just used the
    //action event on delet button and then using fetch would have called delete api
    const confirmed = confirm("Are you sure you want to delete this post?");
    if(confirmed)
    {
        console.log("we clicked delete current Post button");
        const apiUrl = `https://blgpst-v2-sboot-ftend-production.up.railway.app/myBlog/delete/${clickedPostId}`;

        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: null,
        }).then(response => {
            //response will come as a string from backend so it is not working properly coming as stream
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response}`);
            }
            return response;
        }).then( response =>{
            window.location.href =`/adminPage`;
        }
        ).catch(error => {
            // Handle errors during the fetch
            console.error('Fetch error:', error);
        });

    }

    // Prevent the default form submission
    return false;

}





