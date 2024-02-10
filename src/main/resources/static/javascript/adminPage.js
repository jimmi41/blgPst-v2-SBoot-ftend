let allPosts = [];

fetchPosts()
.then(renderPosts)
.catch(error => {
    console.error('Error rendering posts  admin Page .js:', error);
  });


async function fetchPosts() {
    try {
        let response;
        if (typeof window === 'undefined') {
          const apiUrl = 'http://localhost:8080';
           response = await fetch(`${apiUrl}/myBlog/all`);
        } else {
//          const apiUrl = process.env.API_URL; //in railway i will directly define apiUrl
//we can't access env variable at frontend directly without using some 3rd party logic so
//for now i am just adding hardcoded url to it
//            const apiUrl = 'http://localhost:8080';
//           response = await fetch(`${apiUrl}/myBlog/all`);
          response = await fetch('https://blgpst-v2-sboot-ftend-production.up.railway.app/myBlog/all');
        }
        const fetchedPosts = await response.json();
        allPosts = fetchedPosts; // Store fetched posts in the global variable
    } catch (error) {
        console.error('Error fetching posts admin Page .js:', error);
    }
}

function renderPosts() {
    const postsContainer = document.querySelector('.timeline');
    const postTemplate = document.querySelector('#post-template');

    for (let i = 0; i < allPosts.length; i++) {
        const post = allPosts[i]; // Access the current post object

        const clonedPost = postTemplate.content.cloneNode(true);
        const container = clonedPost.querySelector('.container');

        //adding animation delay for all the containers
        let delay = 0.30*i +'s';
        container.style.animationDelay = delay;

        const span = container.querySelector('span');

        // Apply left or right class based on index
        if (i % 2 === 0) {
            container.classList.add('left-container');
            span.classList.add('left-container-arrow');

        } else {
            container.classList.add('right-container');
            span.classList.add('right-container-arrow');
        }

        //appending id's to all textboxes so that when i will click it and move to some other page
        // i can get hold of the specific id of the post
        const textbox = container.querySelector('.textbox');
        textbox.id = 'textbox-' + post.id;


        const image = container.querySelector('img');
        let index = Math.floor(Math.random() * 16);//will return some random number between [0 to 15]
        image.src = "/images/icon/"+index+".png"; // Assuming you have an imageUrl property


        // Populate the container with post content

        const title = container.querySelector('h2');
        title.textContent = post.title; // Assuming you have a title property

        const subtitle = container.querySelector('small');
        subtitle.textContent = post.subtitle;

        const postData = container.querySelector('p');
        postData.textContent = post.postData.slice(0,120)+".......";//so that only some part of text content will be visible

        postsContainer.appendChild(clonedPost);
    }

    //adding eventListner in all the textBoxes
    const textboxes = document.querySelectorAll('.textbox');
    for (let i = 0; i < textboxes.length; i++) {
        const textbox = textboxes[i];
        textbox.addEventListener('click', () => {
            const clickedPostId = textbox.id.replace('textbox-', '');
            window.location.href = `/adminPageEdit?postId=${clickedPostId}`;
        });
    }
}

function navigateToAddNewPost(){
    const button = document.getElementById("addNewPostBtn");
    button.onclick = function () {
        window.location.href = `/adminPageEdit`;
    };
}


