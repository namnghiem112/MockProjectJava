package com.example.mockproject.Entity;
import com.example.mockproject.Entity.num.*;
import lombok.*;
import jakarta.persistence.*;
import java.util.Date;

@Getter
@Setter
@Entity
public class Offer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ContractType contractType;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Position position;

    private String level;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date contractStart;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date contractEnd;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Department department;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date dueDate;

    @Column(nullable = false)
    private Integer basicSalary;

    private String note;
    private String rejectNote;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OfferStatus status;

    @ManyToOne
    @JoinColumn(name = "interview_id",nullable = false)
    private Interview interview;

    @ManyToOne
    @JoinColumn(name = "approver_id",nullable = false)
    private User approver;

    @ManyToOne
    @JoinColumn(name = "recruiter_id",nullable = false)
    private User recruiter;
    @ManyToOne
    @JoinColumn(name = "candidate_id",nullable = false)
    private Candidate candidateOffer;

}
