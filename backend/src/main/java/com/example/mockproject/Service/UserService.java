package com.example.mockproject.Service;

import com.example.mockproject.Dto.UserDto;
import com.example.mockproject.Dto.NewPasswordRequest;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Entity.num.Role;
import org.springframework.data.domain.Page;

public interface UserService {
    UserDto register(UserDto userDto);
    String forgotPassword(String email);
    boolean resetPassword(NewPasswordRequest newPasswordReq);
    boolean isKeyExpired(String verifyKey);
    Page<UserDto> getListUser(int page, int size, Role role,String username);
    UserDto updateUser(int id,UserDto userDto);
    void deleteUser(int id);
    UserDto getUserByID(int id);
    void activeUser(int id);
    void inactiveUser(int id);
    User findByUsername(String username);
}
