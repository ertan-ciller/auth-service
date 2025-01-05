package com.demo.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Frontend URL'lerini ekleyin
        config.addAllowedOrigin("https://auth-frontend-1.onrender.com");  // Production frontend URL
        config.addAllowedOrigin("http://localhost:4200");  // Development için
        
        // Headers ve methods için izinler
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        // Credentials'a izin ver
        config.setAllowCredentials(true);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
} 