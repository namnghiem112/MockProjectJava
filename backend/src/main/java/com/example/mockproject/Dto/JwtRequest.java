package com.example.mockproject.Dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class JwtRequest implements Serializable {
    private String username,password;
}
