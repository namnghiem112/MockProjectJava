package com.example.mockproject.Service.Impl;

import com.example.mockproject.Dto.CandidateDto;
import com.example.mockproject.Dto.CandidateDtoResponse;
import com.example.mockproject.Entity.*;
import com.example.mockproject.Entity.num.CandidateStatus;
import com.example.mockproject.Repository.CandidateJobRepository;
import com.example.mockproject.Repository.JobRepository;
import com.example.mockproject.Repository.UserRepository;
import com.example.mockproject.Repository.CandidateRepository;
import com.example.mockproject.Service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CandidateImpl implements CandidateService {
    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateJobRepository candidateJobRepository;

    @Autowired
    private JobRepository jobRepository;

    @Override
    public ResponseEntity<Boolean> createCandidate(CandidateDto candidateDto) {
        try {
            Candidate candidate = new Candidate();
//            candidate.setCv(candidateDto.getCv());
            candidate.setAddress(candidateDto.getAddress());
            candidate.setDob(candidateDto.getDob());
            candidate.setExp(candidateDto.getExp());
            candidate.setEmail(candidateDto.getEmail());
            candidate.setGender(candidateDto.getGender());
            candidate.setPhone(candidateDto.getPhone());
            candidate.setName(candidateDto.getName());
            candidate.setNote(candidateDto.getNote());
            candidate.setPosition(candidateDto.getPosition());
            candidate.setSkill(candidateDto.getSkill());
            candidate.setStatus(candidateDto.getStatus());
            candidate.setHighestLevel(candidateDto.getHighestLevel());
            User recruiter = userRepository.findById(candidateDto.getRecruitercad())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            candidate.setRecruitercad(recruiter);
            candidate.setCv(candidateDto.getCv());
            this.candidateRepository.save(candidate);
            for (Integer jobID: candidateDto.getJob()) {
                Job job = jobRepository.findById(jobID)
                        .orElseThrow(() -> new RuntimeException("Job not found"));
                candidateJobRepository.save(new CandidateJob(candidate, job));
            }
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(false);
        }
    }

    @Override
    public boolean deleteCandidate(int id) {
        try {
            Optional<Candidate> candidate = candidateRepository.findById(id);
            Candidate candidate1 = candidate.get();
            candidate1.setDeletedAt(LocalDateTime.now());
            this.candidateRepository.save(candidate1);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateCandidate(int id, CandidateDto candidateDto) {
        try {
            Optional<Candidate> candidateOptional = candidateRepository.findById(id);
            Candidate candidate = candidateOptional.get();
//            candidate.setCv(candidateDto.getCv());
            candidate.setAddress(candidateDto.getAddress());
            candidate.setDob(candidateDto.getDob());
            candidate.setExp(candidateDto.getExp());
            candidate.setEmail(candidateDto.getEmail());
            candidate.setGender(candidateDto.getGender());
            candidate.setPhone(candidateDto.getPhone());
            candidate.setName(candidateDto.getName());
            candidate.setNote(candidateDto.getNote());
            candidate.setPosition(candidateDto.getPosition());
            candidate.setSkill(candidateDto.getSkill());
            candidate.setHighestLevel(candidateDto.getHighestLevel());
            candidate.setStatus(candidateDto.getStatus());
            User recruiter = userRepository.findById(candidateDto.getRecruitercad())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            candidate.setRecruitercad(recruiter);
            candidate.setCv(candidateDto.getCv());
            this.candidateRepository.save(candidate);

            List<CandidateJob> candidateJobs = candidateJobRepository.findByCandidateId(candidate);
            candidateJobRepository.deleteAll(candidateJobs);

            // Save new CandidateJob records
            for (Integer jobID : candidateDto.getJob()) {
                Job job = jobRepository.findById(jobID)
                        .orElseThrow(() -> new RuntimeException("Job not found"));
                CandidateJob candidateJob = new CandidateJob(candidate, job);
                candidateJobRepository.save(candidateJob);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public Page<CandidateDtoResponse> getListCandidate(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Candidate> candidates = candidateRepository.findAll(search, pageable);
        List<CandidateDtoResponse> candidateWithJobsDtos = new ArrayList<>();

        candidates.forEach(candidate -> {
            List<CandidateJob> candidateJobs = candidateJobRepository.findByCandidateId(candidate);
            List<Job> jobs = candidateJobs.stream()
                    .map(CandidateJob::getJobId)
                    .collect(Collectors.toList());
            CandidateDtoResponse dto = new CandidateDtoResponse(
                    candidate.getId(),
                    candidate.getName(),
                    candidate.getDob(),
                    candidate.getPhone(),
                    candidate.getEmail(),
                    candidate.getAddress(),
                    candidate.getGender(),
                    candidate.getCv(),
                    candidate.getExp(),
                    candidate.getStatus(),
                    candidate.getNote(),
                    candidate.getHighestLevel(),
                    candidate.getPosition(),
                    jobs,
                    candidate.getSkill(),
                    candidate.getRecruitercad(),
                    candidate.getOriginalFilename());

            candidateWithJobsDtos.add(dto);
        });

        return new PageImpl<>(candidateWithJobsDtos, pageable, candidates.getTotalElements());
    }

    @Override
    public CandidateDtoResponse getDetailCandidate(int id) {
        Optional<Candidate> candidateOptional = candidateRepository.findById(id);
        Candidate candidate = candidateOptional.get();
        List<CandidateJob> candidateJobs = candidateJobRepository.findByCandidateId(candidate);
        List<Job> jobs = candidateJobs.stream()
                    .map(CandidateJob::getJobId)
                    .collect(Collectors.toList());
        CandidateDtoResponse dto = new CandidateDtoResponse(
                    candidate.getId(),
                    candidate.getName(),
                    candidate.getDob(),
                    candidate.getPhone(),
                    candidate.getEmail(),
                    candidate.getAddress(),
                    candidate.getGender(),
                    candidate.getCv(),
                    candidate.getExp(),
                    candidate.getStatus(),
                    candidate.getNote(),
                    candidate.getHighestLevel(),
                    candidate.getPosition(),
                    jobs,
                    candidate.getSkill(),
                    candidate.getRecruitercad(),
                    candidate.getOriginalFilename());
        return dto;
    }

    @Override
    public boolean banCandidate(int id, String status) {
        Optional<Candidate> candidateOptional = candidateRepository.findById(id);
        if (candidateOptional.isPresent()) {
            Candidate candidate = candidateOptional.get();
            candidate.setStatus(CandidateStatus.fromValue(status));
            candidateRepository.save(candidate);
            return true;
        }
        return false;
    }
}