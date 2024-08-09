package com.example.mockproject.Repository;

import com.example.mockproject.Entity.Interview;
import com.example.mockproject.Entity.num.InterviewResult;
import com.example.mockproject.Entity.num.InterviewStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Integer> {
    @Query("SELECT i FROM Interview i WHERE i.title LIKE %:search% ")
    Page<Interview> findAll(String search, Pageable pageable);
    @Query("SELECT i FROM Interview i WHERE i.title LIKE %:search% AND i.status = :status")
    Page<Interview> findAllByStatus(String search, Pageable pageable, InterviewStatus status);
    @Modifying
    @Transactional
    @Query("UPDATE Interview i SET i.note = :note, i.result = :result, i.status = 'INTERVIEWED', i.score = :score, i.interviewerNote = :interviewerNote WHERE i.id = :id")
    void submitResult(int id, String note, InterviewResult result, int score, String interviewerNote);
    @Query("SELECT i FROM Interview i JOIN i.interviewers ui WHERE ui.interviewerId.id = :interviewerId AND i.title LIKE %:search%")
    Page<Interview> findInterviewsByInterviewerId(String search, int interviewerId, Pageable pageable);
    @Query("SELECT i FROM Interview i JOIN i.interviewers ui WHERE ui.interviewerId.id = :interviewerId AND i.title LIKE %:search% AND i.status = :status")
    Page<Interview> findInterviewsByInterviewerIdAndStatus(String search, int interviewerId, Pageable pageable, InterviewStatus status);
    @Query("SELECT i FROM Interview i JOIN i.interviewers ui " +
            "WHERE ui.interviewerId.id = :interviewerId " +
            "AND i.date = :date " +
            "AND i.status NOT IN (:status1, :status2) " +
            "AND ((i.timeStart < :endTime AND i.timeEnd > :startTime))")
    List<Interview> findConflictingInterviews(int interviewerId,
                                              Date date,
                                              Date startTime,
                                              Date endTime,
                                              InterviewStatus status1,
                                              InterviewStatus status2);
}
