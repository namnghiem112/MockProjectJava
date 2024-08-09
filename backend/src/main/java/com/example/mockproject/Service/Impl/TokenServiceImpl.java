package com.example.mockproject.Service.Impl;

import com.example.mockproject.Entity.Token;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Repository.TokenRepository;
import com.example.mockproject.Repository.UserRepository;
import com.example.mockproject.Service.TokenService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class TokenServiceImpl implements TokenService {
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private UserRepository userRepository;
    @Override
    public Token getToken(String refreshToken) {
        return tokenRepository.findByRefreshToken(refreshToken);
    }

    @Override
    public void setAllAcitveFalse(String username) {
        User user=userRepository.findUserByUsername(username);
        List<Token> tokens = tokenRepository.findByUserId(user.getId());
        for (Token token : tokens) {
            token.setActive(false);
            tokenRepository.save(token);
        }
    }



    @Override
    public void saveToken(User user, String refreshToken) {
        Token token = new Token();
        token.setUser(user);
        token.setRefreshToken(refreshToken);
        token.setCreatedDate(new Date());
        token.setExpiredRefreshDate(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24));
        token.setActive(true);
        tokenRepository.save(token);
    }


}

