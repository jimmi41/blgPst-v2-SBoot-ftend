package com.thaledi.blogpost.myBlogPost.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;
@Controller
public class HomeController {

    @GetMapping("/") // Map the root path to this method
    public String home() {
        return "home"; // Return the name of the template to render
    }
    @GetMapping("/storyPage")
    public String showStoryPage() {
        return "storyPage"; // This corresponds to storyPage.html
    }
}
