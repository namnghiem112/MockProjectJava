package com.example.mockproject.Service;


import com.example.mockproject.Dto.CandidateDto;
import com.example.mockproject.Dto.CandidateDtoResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

public interface CandidateService {
    ResponseEntity<Boolean> createCandidate(CandidateDto candidateDto);
    boolean deleteCandidate(int id);
    boolean updateCandidate(int id, CandidateDto candidateDto);
    Page<CandidateDtoResponse> getListCandidate(String search, int page, int size);
    CandidateDtoResponse getDetailCandidate(int id);
    boolean banCandidate(int id, String status);
}