package com.example.mockproject.Entity;
import com.example.mockproject.Entity.num.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date dob;

    @Column(length = 10, nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = true)
    private String cv;

    private Integer exp;

    @Column(nullable = true)
    private LocalDateTime deletedAt;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CandidateStatus status;

    private String note;

    @Column(nullable = true)
    private String OriginalFilename;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private HighestLevel highestLevel;

    @Enumerated(EnumType.STRING)
    private Position position;
    private String skill;

    @ManyToOne
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruitercad;
//    @OneToMany(mappedBy = "candidate")
//    List<Interview> interviews = new ArrayList<>();
//    @OneToMany(mappedBy = "candidateOffer")
//    List<Offer> interviewsoffer = new ArrayList<>();
//    @OneToMany(mappedBy = "candidateId",fetch = FetchType.EAGER)
//    List<CandidateJob> candidateJobs = new ArrayList<>();
}
