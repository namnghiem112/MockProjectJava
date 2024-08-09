package com.example.mockproject.Config;

import com.example.mockproject.Config.Jwt.JwtEntryPoint;
import com.example.mockproject.Config.Jwt.JwtFilters;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    @Autowired
    private JwtEntryPoint jwtEntryPoint;
    @Autowired
    private JwtFilters jwtFilters;
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.cors();
        httpSecurity.csrf().disable()
                .authorizeRequests()
                .requestMatchers("/api/auth/**","/resetpassword").permitAll()
                .requestMatchers("/api/upload/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/api/job/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/api/user/**").hasAnyRole("RECRUITER","MANAGER","ADMIN","INTERVIEWER")
                .requestMatchers("/api/user/**").hasRole("ADMIN")
                .requestMatchers("/api/interview/submit").hasRole("INTERVIEWER")
                .requestMatchers(HttpMethod.GET,"/api/candidate/**","/api/interview/**")
                .hasAnyRole("INTERVIEWER","RECRUITER","MANAGER","ADMIN")
                .requestMatchers("/api/offers/create","/api/offers/update/**").not().hasRole("INTERVIEWER")
                .requestMatchers("/api/offers/approve","/api/offers/reject").hasAnyRole("MANAGER","ADMIN")
                .requestMatchers("/api/candidate/**","/api/job/**","/api/interview/**","/api/offers/́́**́").hasAnyRole("RECRUITER","MANAGER","ADMIN")
                .anyRequest().authenticated()
                .and()
                .exceptionHandling().authenticationEntryPoint(jwtEntryPoint).and().sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        httpSecurity.addFilterBefore(jwtFilters,UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }

}