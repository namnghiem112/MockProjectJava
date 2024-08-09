package com.example.mockproject.Repository;
import com.example.mockproject.Entity.Candidate;
import com.example.mockproject.Entity.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Integer> {
    Page<Offer> findAll( Pageable pageable);
    List<Offer> findByCandidateOfferId(int candidateId);
}
