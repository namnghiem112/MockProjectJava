package com.example.mockproject.Entity;
import com.example.mockproject.Entity.num.CandidateStatus;
import com.example.mockproject.Entity.num.InterviewResult;
import com.example.mockproject.Entity.num.InterviewStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date date;

    private String location;

    @Column(nullable = false)
    @Temporal(TemporalType.TIME)
    private Date timeStart;

    @Column(nullable = false)
    @Temporal(TemporalType.TIME)
    private Date timeEnd;

    @Enumerated(EnumType.STRING)
    private InterviewResult result;
    private String note;

    private int score;
    private String interviewerNote;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InterviewStatus status;

    private String meetingLink;

    @ManyToOne
    @JoinColumn(name = "job_id",nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "candidate_id",nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "recruiter_id",nullable = false)
    private User recruiter;

    @OneToMany(mappedBy = "interviewId", fetch = FetchType.EAGER)
    List<InterviewerInterview> interviewers = new ArrayList<>();
}
