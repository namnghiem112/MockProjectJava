package com.example.mockproject.Repository;

import com.example.mockproject.Entity.Candidate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Integer> {

    @Query("SELECT c FROM Candidate c WHERE (c.name LIKE %:search% " +
            "OR c.address LIKE %:search% " +
            "OR c.email LIKE %:search% " +
            "OR CAST(c.status AS string) LIKE %:search% " +
            "OR c.phone LIKE %:search%) " +
            "AND c.deletedAt IS NULL")
    Page<Candidate> findAll(String search, Pageable pageable);


}