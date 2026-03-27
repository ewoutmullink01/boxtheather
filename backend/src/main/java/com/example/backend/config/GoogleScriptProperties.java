package com.example.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.google.script")
public record GoogleScriptProperties(
        String url,
        String secret
) {}
