package com.example.mockproject.Dto;

import com.example.mockproject.Entity.num.Role;
import com.example.mockproject.Entity.num.UserStatus;
import com.example.mockproject.Entity.num.Department;
import com.example.mockproject.Entity.num.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Date;

@Data
public class UserDto {
    private int id;

    @NotBlank(message = "Full name cannot be empty")
    private String fullname;

    private String username;

    private String password;

    private Date createdDate;

    @NotNull(message = "Role cannot be empty")
    private Role role;

    private String verifyKey;
    private Date keyCreated;
    private Date keyExpired;

    @NotNull(message = "Status cannot be empty")
    private UserStatus status;

    @NotBlank(message = "Email cannot be empty")
    @Email(regexp = "^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@gmail\\.com$", message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone cannot be empty")
    @Pattern(regexp = "^0\\d{9}$", message = "Invalid phone number format")
    private String phone;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    @NotNull(message = "Date of birth cannot be null")
    private Date dob;

    @NotNull(message = "Department cannot be empty")
    private Department department;

    private String note;

    @NotNull(message = "Gender cannot be empty")
    private Gender gender;
}
