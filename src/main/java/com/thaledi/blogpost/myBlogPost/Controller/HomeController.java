package com.thaledi.blogpost.myBlogPost.Controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class HomeController {

    @GetMapping("/") // Map the root path to this method
    public String home() { return "home"; // Return the name of the template to render
    }

    @GetMapping("/navbar")
    public String getNavbar() {
        return "navbar"; // Name of your Thymeleaf template for navbar
    }


    @GetMapping("/storyPage")
    public String showStoryPage() {
        return "storyPage"; // This corresponds to storyPage.html
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/adminPage")
    public String showAdminPage() {
        return "adminPage"; // This corresponds to storyPage.html
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/adminPageEdit")
    public String showAdminPageEdit() {
        return "adminPageEdit"; // This corresponds to storyPage.html
    }

}
