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
            const appUrl = process.env.API_URL; ////in railway i will directly define apiUrl
            post = await fetch('https://blgpst-v2-sboot-ftend-production.up.railway.app/myBlog/getOnePost/${clickedPostId}');
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

    const postData = document.querySelector('.post-data');
    postData.textContent = clickedPostData.postData;

    const image = document.querySelector('.post-img img');
    image.src = clickedPostData.imageUrl; // Assuming you have an imageUrl property

    //if image url is null
    if(image.src == null)
    {
        image.src = "/images/bilkhet.jpg";
    }
    //image url exists but that image is not present in image folder so we will give the default image to this
    image.onerror = () => {
        image.src = "/images/bilkhet.jpg";
    }
}



