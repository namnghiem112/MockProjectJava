package com.example.mockproject.Entity;
import com.example.mockproject.Entity.num.Department;
import com.example.mockproject.Entity.num.Gender;
import com.example.mockproject.Entity.num.Role;
import com.example.mockproject.Entity.num.UserStatus;
import lombok.*;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String fullname;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Temporal(TemporalType.DATE)
    private Date createdDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    private String verifyKey;

    private Date keyCreated;

    private Date keyExpired;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(nullable = false)
    private String email;

    @Column(length = 10)
    private String phone;

    private String address;

    @Temporal(TemporalType.DATE)
    private Date dob;

    @Enumerated(EnumType.STRING)
    private Department department;

    private String note;

    @Enumerated(EnumType.STRING)
    private Gender gender;
//
//    @OneToMany(mappedBy = "recruiter", fetch = FetchType.EAGER)
//    List<Interview> intuser = new ArrayList<>();
//
//    @OneToMany(mappedBy = "approver", fetch = FetchType.EAGER)
//    List<Offer> offuser = new ArrayList<>();
//    @OneToMany(mappedBy = "recruiter", fetch = FetchType.EAGER)
//    List<Offer> offusers = new ArrayList<>();
//
//    @OneToMany(mappedBy = "interviewerId", fetch = FetchType.EAGER)
//    List<InterviewerInterview> interviewerint = new ArrayList<>();
//    @OneToMany(mappedBy = "recruitercad", fetch = FetchType.EAGER)
//    List<Candidate> candidates = new ArrayList<>();

}
