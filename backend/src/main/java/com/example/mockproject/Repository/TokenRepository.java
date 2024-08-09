package com.example.mockproject.Repository;

import com.example.mockproject.Entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TokenRepository extends JpaRepository<Token, Integer> {
    Token findByRefreshToken(String refreshToken);
    List<Token> findByUserId(int id);
}
