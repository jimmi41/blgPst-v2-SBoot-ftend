package com.thaledi.blogpost.myBlogPost.Controller;

import com.thaledi.blogpost.myBlogPost.Post;
import com.thaledi.blogpost.myBlogPost.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
//remove this cross origin code it is not secure it is allwing all origins
//@CrossOrigin(origins = "*")
@RequestMapping(path="/myBlog")
public class MainController  {

    @Autowired
    private PostRepository postRepository;

    @PostMapping(path="/add")
    public @ResponseBody Post addNewPost (@RequestParam String title ,
                                          @RequestParam String subtitle,
                                          @RequestParam LocalDateTime dateOfPost,
                                          @RequestParam String imageUrl,
                                          @RequestParam String postData){
        //we need to check for data validation but we are not doing it currently
        Post blogPost = new Post();
        blogPost.setTitle(title);
        blogPost.setSubtitle(subtitle);
        blogPost.setDateOfPost(dateOfPost);
        blogPost.setImageUrl(imageUrl);
        blogPost.setPostData(postData);

        postRepository.save(blogPost);
        return (blogPost);
// curl http://localhost:8080/myBlog/add -d title="44test title" -d subtitle="44test Subtitle" -d dateOfPost="2023-12-25T22:33:44" -d imageUrl="https://example.com/44image.jpg" -d postData="44this is actual post data or the story"
    }
    @GetMapping(path = "/all")
    public @ResponseBody Iterable<Post> getAllPosts(){
        return postRepository.findAll();
    }
    @GetMapping(path = "/getOnePost/{id}")
    public @ResponseBody ResponseEntity<Post> getOnePost(@PathVariable Integer id){
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            return ResponseEntity.ok(post.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(path="/delete/{id}")
    public String deleteUser(@PathVariable Integer id) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            postRepository.deleteById(id);
            return "Post deleted successfully";
        } else {
            return "Post does not exist";
        }

    }

    @PutMapping("/update/{id}")
    public @ResponseBody Post updatePost(@PathVariable Integer id,
                                         @RequestParam(required = false) String title,
                                         @RequestParam(required = false) String subtitle,
                                         @RequestParam(required = false) LocalDateTime dateOfPost,
                                         @RequestParam(required = false) String imageUrl,
                                         @RequestParam(required = false) String postData) throws Exception {

        Optional<Post> post = postRepository.findById(id);

        if (post.isPresent()) {
            // Apply updates from request parameters
            if (title != null) {
                post.get().setTitle(title);
            }
            if (subtitle != null) {
                post.get().setSubtitle(subtitle);
            }
            if (dateOfPost != null) {
                post.get().setDateOfPost(dateOfPost);
            }
            if (imageUrl != null) {
                post.get().setImageUrl(imageUrl);
            }
            if (postData != null) {
                post.get().setPostData(postData);
            }

            // Validate updated data before saving (as discussed earlier)
//            validatePostData(post.get().getTitle(), post.get().getSubtitle(),
//                    post.get().getDateOfPost(), post.get().getImageUrl(), post.get().getPostData());

            // Save the updated post
            Post updatedPost = postRepository.save(post.get());
            return updatedPost;
        } else {
            throw new Exception("Post with ID " + id + " not found");
        }
// curl -X PUT http://localhost:8080/myBlog/update/6 -d id="6" -d title="Updated test title" -d subtitle="Updated test Subtitle" -d dateOfPost="2023-12-25T22:33:44" -d imageUrl="https://example.com/Updated.jpg" -d postData="Updated is actual post data or the story"
    }
    private void validatePostData(String title, String subtitle, String dateOfPost, String imageUrl, String postData) {
//        // Example checks (adapt based on your database constraints):
//        if (title.isEmpty()) {
//            throw new ConstraintViolationException("Title is mandatory");
//        }
//        if (title.length() > 255) {
//            throw new ConstraintViolationException("Title cannot exceed 255 characters");
//        }
//        // Add checks for other fields and constraints as needed

    }

}
