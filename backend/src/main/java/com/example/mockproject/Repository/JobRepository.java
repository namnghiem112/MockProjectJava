package com.example.mockproject.Repository;

import com.example.mockproject.Entity.Job;
import com.example.mockproject.Entity.num.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Integer> {
    @Query("SELECT j FROM Job j WHERE (:title IS NULL OR j.title LIKE %:title%) AND (:status IS NULL OR j.status = :status)")
    Page<Job> findSearchAll(String title, JobStatus status, Pageable pageable);
}
