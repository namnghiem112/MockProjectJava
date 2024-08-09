package com.example.mockproject.Dto;

import com.example.mockproject.Entity.Interview;
import com.example.mockproject.Entity.Job;
import com.example.mockproject.Entity.Offer;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Entity.num.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class CandidateDtoResponse {
    private int id;
    private String name;
    private Date dob;
    private String phone;
    private String email;
    private String address;
    private Gender gender;
    private String cv;
    private Integer exp;
    private CandidateStatus status;
    private String note;
    private HighestLevel highestLevel;
    private Position position;
    List<Job> job = new ArrayList<>();
    private String skill;
    private User recruitercad;
    private String originalFilename;

    public CandidateDtoResponse(int id, String name, Date dob, String phone, String email, String address, Gender gender, String cv, Integer exp, CandidateStatus status, String note, HighestLevel highestLevel,Position position, List<Job> job, String skill, User recruitercad, String originalFilename) {
        this.id = id;
        this.name = name;
        this.dob = dob;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.gender = gender;
        this.cv = cv;
        this.exp = exp;
        this.status = status;
        this.note = note;
        this.highestLevel = highestLevel;
        this.position = position;
        this.job=job;
        this.skill = skill;
        this.recruitercad = recruitercad;
        this.originalFilename = originalFilename;
    }
}
