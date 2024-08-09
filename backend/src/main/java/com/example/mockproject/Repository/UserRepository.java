package com.example.mockproject.Repository;

import com.example.mockproject.Entity.User;
import com.example.mockproject.Entity.num.Role;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    User findUserByUsername(String username);
    User findUserByEmail(String email);
    List<User> findUserByFullname(String fullname);
    @Query("SELECT u FROM User u WHERE u.role != :role")
    Page<User> findUsersExcludingRole(@Param("role") Role role, Pageable pageable);
    @Query("SELECT u FROM User u WHERE u.username LIKE %:username% AND u.role = :role")
    Page<User> findUsersByUsernameContainingAndRole(@Param("username") String username, @Param("role") Role role, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.username LIKE %:username%")
    Page<User> findUsersByUsernameContaining(@Param("username") String username, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.role = :role")
    Page<User> findUsersByRole(@Param("role") Role role, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.verifyKey = :verifyKey, u.keyCreated = :tokenCreated, u.keyExpired = :tokenExpired WHERE u.email = :email")
    void updateTokenDetailsByEmail(String email, String verifyKey, Date tokenCreated, Date tokenExpired);
    @Query("SELECT u.keyExpired FROM User u WHERE u.verifyKey = :verifyKey")
    Date getTokenExpiredDate(String verifyKey);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :password, u.keyExpired = :expired WHERE u.verifyKey = :verifyKey")
    void updatePassword(String password, String verifyKey, Date expired);
    @Query("SELECT COUNT(*) FROM User u WHERE u.verifyKey = :verifyKey")
    int getUserByToken(String verifyKey);
}
