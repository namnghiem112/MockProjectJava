package com.example.mockproject.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "candidate_job")
@Data
public class CandidateJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidateId;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job jobId;

    public CandidateJob(Candidate candidateId, Job jobId) {
        this.candidateId = candidateId;
        this.jobId = jobId;
    }

    public CandidateJob() {

    }
}
