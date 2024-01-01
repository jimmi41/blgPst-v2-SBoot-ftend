const allPosts = JSON.parse(localStorage.getItem('allPosts'));
const urlParams = new URLSearchParams(window.location.search);

const clickedPostId = urlParams.get('postId');
const clickedPostData = allPosts.find(item => item.id == clickedPostId);//we have to use == as clickedPostId is string and allPost[i].id == number

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
};