package com.example.mockproject.Dto;

import com.example.mockproject.Entity.*;
import com.example.mockproject.Entity.num.InterviewResult;
import com.example.mockproject.Entity.num.InterviewStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class InterviewDto {
    private int id;
    private String title;
    private Date date;
    private String location;
    private String timeStart;
    private String timeEnd;
    private InterviewResult result;
    private String note;
    private int score;
    private String interviewerNote;
    private InterviewStatus status;
    private String meetingLink;
    private Job job;
    private Candidate candidate;
    private User recruiter;
    private List<User> interviewers;
}
