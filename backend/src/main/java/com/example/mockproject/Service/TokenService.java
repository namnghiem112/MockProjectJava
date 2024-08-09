package com.example.mockproject.Service;

import com.example.mockproject.Entity.Token;
import com.example.mockproject.Entity.User;

import java.util.Date;

public interface TokenService {
    Token getToken(String refreshToken);
    void setAllAcitveFalse(String username);
    void saveToken(User user, String refreshToken);

}
