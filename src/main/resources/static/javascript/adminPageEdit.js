const urlParams = new URLSearchParams(window.location.search);
const clickedPostId = urlParams.get('postId');
const MAX_IMAGE_SIZE = 400 * 1024; // 400 KB

let clickedPostData = null;

// ---------- IMAGE SIZE VALIDATION (IMMEDIATE FEEDBACK) ----------
document.addEventListener("DOMContentLoaded", () => {

    const imageInput = document.getElementById("imageFile");

    // Buttons may or may not exist depending on mode
    const addBtn = document.getElementById("addPostBtn");
    const updateBtn = document.getElementById("updatePostBtn");

    // Create error message dynamically if not present
    let errorText = document.getElementById("imageError");
    if (!errorText && imageInput) {
        errorText = document.createElement("p");
        errorText.id = "imageError";
        errorText.style.color = "red";
        errorText.style.display = "none";
        errorText.style.fontSize = "14px";
        errorText.textContent = "Image size must be less than 500 KB";
        imageInput.parentNode.appendChild(errorText);
    }

    if (!imageInput) return;

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];

        // No file → allow submit
        if (!file) {
            clearImageError();
            return;
        }

        // Size validation
        if (file.size > MAX_IMAGE_SIZE) {
            showImageError();
        } else {
            clearImageError();
        }
    });

    function showImageError() {
        errorText.style.display = "block";
        imageInput.style.border = "2px solid red";

        if (addBtn) addBtn.disabled = true;
        if (updateBtn) updateBtn.disabled = true;
    }

    function clearImageError() {
        errorText.style.display = "none";
        imageInput.style.border = "";

        if (addBtn) addBtn.disabled = false;
        if (updateBtn) updateBtn.disabled = false;
    }
});

// Update the hidden textarea with Quill content
//const storyTextarea = document.getElementById('story');
//storyTextarea.value = quill.root.innerHTML;

if(clickedPostId!==null)
{
    //removing the add form
    const addForm = document.getElementById("addPostSection");
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
//we are using this 3rd party libraryy quill so that we can provide user the text formatting optoins
//and we are initializing in all cases as either new post or existing post we need that formatting
//Quill can't be used directly on text area so using it on div and then passing quill's value to text area
const quill = new Quill('#quill-container', {
    theme: 'snow' // we can use 'bubble' for a different UI
});



async function fetchOnePost() {
    try {
        let post;
        if (typeof window === 'undefined')
        {
            const apiUrl = 'http://localhost:8080';
            post = await fetch(`${apiUrl}/myBlog/getOnePost/${clickedPostId}`);
        }
        else
        {
            post = await fetch(`/myBlog/getOnePost/${clickedPostId}`);
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

//    const postData = document.getElementById('story');
//    postData.value = clickedPostData.postData;
    quill.root.innerHTML = clickedPostData.postData;

    const dateOfPost = document.getElementById('date');
    dateOfPost.value = clickedPostData.dateOfPost;


}
async function onUpdatePost(form){
    const formData = new FormData(form);
    event.preventDefault();
    console.log("we clicked submit button");
    const apiUrl = `/myBlog/update/${clickedPostId}`;

    let requestBody = {};
    // Use FormData to serialize the form data
    requestBody.title = form.elements['title'].value;
    requestBody.subtitle = form.elements['subtitle'].value;
    requestBody.postData =  quill.root.innerHTML;
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
    }).then( async (data) => {
         const imageInput = document.getElementById("imageFile");
         const imageFile = imageInput ? imageInput.files[0] : null;

         if (imageFile) {
             await uploadPostImage(clickedPostId, imageFile);
         }

         window.location.href = `/adminPage`;
    })
        .catch(error => {
        // Handle errors during the fetch
        console.error('Fetch error:', error);
    });
    // Prevent the default form submission
    return false;
}
async function onAddNewPost(form){
    const formData = new FormData(form);
    event.preventDefault();
    console.log("we clicked Add new Post button");
    const apiUrl = `/myBlog/add`;

        let requestBody = {};
        // Use FormData to serialize the form data
        requestBody.title = form.elements['title'].value;
        requestBody.subtitle = form.elements['subtitle'].value;
        requestBody.postData =  quill.root.innerHTML;
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
        }).then(async (response) =>{
                //we are first saving the post getting the id then firing the image upload endpoint with that id
                const postId = response.id;
                const imageInput = document.getElementById("imageFile");
                const imageFile = imageInput ? imageInput.files[0] : null;

                if (imageFile) {
                    await uploadPostImage(postId, imageFile);
                }

                window.location.href = `/adminPage`;
            }
        ).catch(error => {
            //errors during the fetch
            console.error('Fetch error:', error);
        });
        return false;
}
async function uploadPostImage(postId, imageFile) {

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch(`/myBlog/uploadImage/${postId}`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        console.error("Image upload failed for postId:", postId);
    }
}

function deleteCurrentPost(form){
    //we could have done better instead of using form we could have just used the
    //action event on delete button and then using fetch would have called delete api
    const confirmed = confirm("Are you sure you want to delete this post?");
    if(confirmed)
    {
        console.log("we clicked delete current Post button");
        const apiUrl = `/myBlog/delete/${clickedPostId}`;

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





