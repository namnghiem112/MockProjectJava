package com.example.mockproject.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "interviewer_interview")
public class InterviewerInterview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "interviewer_id")
    private User interviewerId;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "interview_id")
    private Interview interviewId;
}
