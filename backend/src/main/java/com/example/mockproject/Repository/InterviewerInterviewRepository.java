package com.example.mockproject.Repository;

import com.example.mockproject.Entity.Interview;
import com.example.mockproject.Entity.InterviewerInterview;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface InterviewerInterviewRepository extends CrudRepository<InterviewerInterview, Integer> {
    @Transactional
    @Modifying
    @Query("DELETE FROM InterviewerInterview ii WHERE ii.interviewId = :interviewId")
    void deleteInterview(Interview interviewId);
}
