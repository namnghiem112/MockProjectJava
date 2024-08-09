package com.example.mockproject.Repository;

import com.example.mockproject.Entity.Candidate;
import com.example.mockproject.Entity.CandidateJob;
import com.example.mockproject.Entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateJobRepository extends JpaRepository<CandidateJob, Integer> {
    List<CandidateJob> findByCandidateId(Candidate candidateId);
    CandidateJob findByCandidateIdAndJobId(Candidate candidateId, Job jobId);
}
