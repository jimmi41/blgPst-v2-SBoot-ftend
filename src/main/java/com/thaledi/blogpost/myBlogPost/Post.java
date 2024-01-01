package com.thaledi.blogpost.myBlogPost;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;


import java.time.LocalDateTime;

@Entity
@Table(name = "post")  // Explicitly specify table name for clarity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)  // Enforce constraints
    private String title;

    @Column(nullable = false, length = 255)
    private String subtitle;

    @Column(nullable = false)
    private LocalDateTime dateOfPost;

    @Column(length = 255)
    private String imageUrl;  // Use camelCase for consistency

    @Column(nullable = false, columnDefinition = "TEXT")  // Specify TEXT for large text
    private String postData;  // Use camelCase for consistency

    // Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public LocalDateTime getDateOfPost() {
        return dateOfPost;
    }

    public void setDateOfPost(LocalDateTime dateOfPost) {
        this.dateOfPost = dateOfPost;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getPostData() {
        return postData;
    }

    public void setPostData(String postData) {
        this.postData = postData;
    }


    @Override
    public String toString() {
        return "Post{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", subtitle='" + subtitle + '\'' +
                ", dateOfPost=" + dateOfPost +
                ", imageUrl='" + imageUrl + '\'' +
                ", postData='" + postData + '\'' +
                '}';
    }
}
