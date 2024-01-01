package com.thaledi.blogpost.myBlogPost;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.thaledi.blogpost.myBlogPost")
public class MyBlogPostApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyBlogPostApplication.class, args);
	}

}
