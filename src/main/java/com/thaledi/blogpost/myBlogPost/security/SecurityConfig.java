package com.thaledi.blogpost.myBlogPost.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
            httpSecurity.csrf().disable()
                    .authorizeHttpRequests()
                    .requestMatchers("/myBlog/add").authenticated()
                    .requestMatchers("/myBlog/delete/**").authenticated()
                    .requestMatchers("/myBlog/update/**").authenticated()
                    .requestMatchers("/").permitAll()
                    .requestMatchers("/**").permitAll()
                    .and()
                    .formLogin();
            return httpSecurity.build();
    }
}
