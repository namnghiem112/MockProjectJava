package com.example.mockproject.Dto;

import com.example.mockproject.Entity.Interview;
import com.example.mockproject.Entity.Job;
import com.example.mockproject.Entity.Offer;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Entity.num.*;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class CandidateDto {
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
    List<Integer> job = new ArrayList<>();
    private String skill;
    private Integer recruitercad;
    private String originalFilename;

    public CandidateDto() {
    }

    List<Interview> interviews = new ArrayList<>();
    List<Offer> interviewsoffer = new ArrayList<>();

    public CandidateDto(String name, Date dob, String phone, String email, String cv, String address, Gender gender, Integer exp, CandidateStatus status, String note, HighestLevel highestLevel,Position position, List<Integer> job, String skill, Integer recruitercad, String originalFilename) {
        this.name = name;
        this.dob = dob;
        this.phone = phone;
        this.email = email;
        this.cv = cv;
        this.address = address;
        this.gender = gender;
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