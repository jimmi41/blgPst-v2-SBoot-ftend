package com.thaledi.blogpost.myBlogPost.Controller;

import com.thaledi.blogpost.myBlogPost.Post;
import com.thaledi.blogpost.myBlogPost.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.multipart.MultipartFile;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.Optional;

@RestController
//remove this cross origin code it is not secure it is allwing all origins
//@CrossOrigin(origins = "*")
@RequestMapping(path="/myBlog")
public class MainController  {

    @Autowired
    private PostRepository postRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(path="/add")
    public @ResponseBody Post addNewPost ( @RequestBody Map<String, Object> newPostData) throws Exception{
        //we need to check for data validation but we are not doing it currently
        try
        {
            Post blogPost = new Post();
            blogPost.setTitle((String) newPostData.get("title"));
            blogPost.setSubtitle((String) newPostData.get("subtitle"));
            blogPost.setDateOfPost(LocalDate.parse((String) newPostData.get("dateOfPost")));
            blogPost.setImageUrl((String) newPostData.get("imageUrl"));
            blogPost.setPostData((String) newPostData.get("postData"));

            //this savedPost so that we can get the rowId(postId) which we will immediately use for image upload in same row
            Post savedPost = postRepository.save(blogPost);
            return savedPost;
        }catch (Exception e)
        {
            System.out.println("Got an error while adding a new post in main controller .java"+e);
            return null;
        }


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


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(path="/delete/{id}")
    public String deletePost(@PathVariable Integer id) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            postRepository.deleteById(id);
            return "This post is deleted with id: "+id;

        } else {
            System.out.println("This post doesn't exist. Id : "+id);
            return "ERROR This post doesn't exist. Id : "+id;
        }

    }



    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public @ResponseBody Post updatePost(@PathVariable Integer id,
                                         @RequestBody Map<String, Object> updatedPostData) throws Exception {

        Optional<Post> post = postRepository.findById(id);

        if (post.isPresent()) {
            // Apply updates from request parameters
            String title = (String) updatedPostData.get("title");
            String subtitle = (String) updatedPostData.get("subtitle");
            String imageUrl = (String) updatedPostData.get("imageUrl");
            String postData = (String) updatedPostData.get("postData");
            String dateOfPost = (String) updatedPostData.get("dateOfPost");

            if (title != null) {
                post.get().setTitle(title);
            }
            if (subtitle != null) {
                post.get().setSubtitle(subtitle);
            }
            if (imageUrl != null) {
                post.get().setImageUrl(imageUrl);
            }
            if (postData != null) {
                post.get().setPostData(postData);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");



            try {
                LocalDate localDate = LocalDate.parse(dateOfPost, formatter);
                post.get().setDateOfPost(localDate);
                System.out.println(post.get().getDateOfPost());

            } catch (DateTimeParseException e) {
                System.out.println("getting some error in parsing the date in main controller update function");
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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/uploadImage/{id}")
    public ResponseEntity<String> uploadImage(@PathVariable Integer id, @RequestParam("file") MultipartFile file) throws Exception {

        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Basic validation
        if (!file.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body("Only image files allowed");
        }

        Post post = postOpt.get();
        post.setImageData(file.getBytes());
        post.setImageContentType(file.getContentType());

        postRepository.save(post);

        return ResponseEntity.ok("Image uploaded successfully");
    }

    @GetMapping("/image/{postId}")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer postId) {

        Optional<Post> postOpt = postRepository.findById(postId);

        if (postOpt.isEmpty() || postOpt.get().getImageData() == null) {
            return ResponseEntity.notFound().build();
        }

        Post post = postOpt.get();

        return ResponseEntity.ok()
                .header("Content-Type", post.getImageContentType())
                .body(post.getImageData());
    }


}
