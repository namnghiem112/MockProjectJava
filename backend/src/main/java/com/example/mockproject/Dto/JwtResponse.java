package com.example.mockproject.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatusCode;

import java.io.Serializable;
@Data
@AllArgsConstructor
public class JwtResponse implements Serializable {
    private String token;
    private String refreshToken;
}
