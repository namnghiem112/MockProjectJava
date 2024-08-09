package com.example.mockproject.Entity;

import com.example.mockproject.Entity.num.Benefit;
import com.example.mockproject.Entity.num.JobStatus;
import com.example.mockproject.Entity.num.Level;
import com.example.mockproject.Entity.num.Skill;
import lombok.*;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@Entity
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date createdDate;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date endDate;

    @Column(nullable = false)
    private String level;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @Column(nullable = false)
    private String skill;

    @Column(nullable = false)
    private String benefits;

    private String workingAddress;

    private Integer salaryRangeFrom;

    private Integer salaryRangeTo;

    private String description;

//    @OneToMany(mappedBy = "job")
//    List<Interview> InterviewJob = new ArrayList<>();
    private boolean checked;
}
