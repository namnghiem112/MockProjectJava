package com.example.mockproject.Dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class NewPasswordRequest {
    private String password;
    private String verifyKey;
}
