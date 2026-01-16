const urlParams = new URLSearchParams(window.location.search);
const clickedPostId = urlParams.get('postId');
let clickedPostData = null;

fetchOnePost()
.then(fillRenderDetail)
.catch(error => {
    console.error('Error filling render detail post in story page .js:', error);
  });

async function fetchOnePost() {
    try {
        let post;
        if (typeof window === 'undefined')
        {
            const apiUrl = 'http://localhost:8080';
            post = await fetch(`${apiUrl}/myBlog/getOnePost/${clickedPostId}`);
        } else
        {
            post = await fetch(`/myBlog/getOnePost/${clickedPostId}`);
        }
        const fetchedPost = await post.json();
        clickedPostData = fetchedPost; // Store fetched post in the global variable
    } catch (error) {
        console.error('Error fetching post in story page.js ', error);
    }
}

function fillRenderDetail() {
    const title = document.querySelector('.post-title');
    title.textContent = clickedPostData.title;

    const subtitle = document.querySelector('.post-subtitle');
    subtitle.textContent = clickedPostData.subtitle;

    const quillContainer = document.querySelector('#quill-container');
    const quillInstance = new Quill(quillContainer, {
        theme: 'snow',
        readOnly: true,
        modules: {
            toolbar: false // Disable the toolbar
        }
    });
    quillInstance.root.innerHTML =  clickedPostData.postData;
//    const postData = document.querySelector('.post-data');
//    postData.textContent = clickedPostData.postData;

    const image = document.querySelector('.post-img img');
//    image.src = clickedPostData.imageUrl; // Assuming you have an imageUrl property
      image.src = `/myBlog/image/${clickedPostId}`;

    //if some error comes show static image
    image.onerror = () => {
        image.src = "/images/bilkhet.jpg";
    };
}



