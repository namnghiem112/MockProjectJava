package com.example.mockproject.Controller;

import com.example.mockproject.Dto.CandidateDto;
import com.example.mockproject.Dto.CandidateDtoResponse;
import com.example.mockproject.Entity.Candidate;
import com.example.mockproject.Entity.num.CandidateStatus;
import com.example.mockproject.Entity.num.Gender;
import com.example.mockproject.Entity.num.HighestLevel;
import com.example.mockproject.Entity.num.Position;
import com.example.mockproject.Service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.parser.Entity;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/candidate")
public class CandidateController {
    @Autowired
    private CandidateService candidateService;

    @PostMapping("/insertCandidate")
    public ResponseEntity<Boolean> createCandidate(
        @RequestParam("name") String name,
        @RequestParam("dob") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dob,
        @RequestParam("phone") String phone,
        @RequestParam("email") String email,
        @RequestParam("address") String address,
        @RequestParam("gender") Gender gender,
        @RequestParam("cv") String cv,
        @RequestParam("skill") String skill,
        @RequestParam("recruitercad") Integer recruitercad,
        @RequestParam("note") String note,
        @RequestParam("status") CandidateStatus status,
        @RequestParam("exp") Integer exp,
        @RequestParam("highestLevel") HighestLevel highestLevel,
        @RequestParam("position") Position position,
        @RequestParam("job") List<Integer> job) {

            CandidateDto candidateDto = new CandidateDto();
            candidateDto.setName(name);
            candidateDto.setDob(dob);
            candidateDto.setPhone(phone);
            candidateDto.setEmail(email);
            candidateDto.setAddress(address);
            candidateDto.setGender(gender);
            candidateDto.setSkill(skill);
            candidateDto.setRecruitercad(recruitercad);
            candidateDto.setNote(note);
            candidateDto.setStatus(status);
            candidateDto.setExp(exp);
            candidateDto.setHighestLevel(highestLevel);
            candidateDto.setPosition(position);
            candidateDto.setJob(job);
            candidateDto.setCv(cv);
            return candidateService.createCandidate(candidateDto);
    }

    @PostMapping("/updateCandidate/{id}")
    public void updateCandidate(@PathVariable("id") Integer id,
                                @RequestParam("name") String name,
                                @RequestParam("dob") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dob,
                                @RequestParam("phone") String phone,
                                @RequestParam("email") String email,
                                @RequestParam("address") String address,
                                @RequestParam("gender") Gender gender,
                                @RequestParam("cv") String cv,
                                @RequestParam("skill") String skill,
                                @RequestParam("recruitercad") Integer recruitercad,
                                @RequestParam("note") String note,
                                @RequestParam("status") CandidateStatus status,
                                @RequestParam("exp") Integer exp,
                                @RequestParam("highestLevel") HighestLevel highestLevel,
                                @RequestParam("position") Position position,
                                @RequestParam("job") List<Integer> job
    ) {
        CandidateDto candidateDto = new CandidateDto();
        candidateDto.setName(name);
        candidateDto.setDob(dob);
        candidateDto.setPhone(phone);
        candidateDto.setEmail(email);
        candidateDto.setAddress(address);
        candidateDto.setGender(gender);
        candidateDto.setSkill(skill);
        candidateDto.setRecruitercad(recruitercad);
        candidateDto.setNote(note);
        candidateDto.setStatus(status);
        candidateDto.setExp(exp);
        candidateDto.setHighestLevel(highestLevel);
        candidateDto.setPosition(position);
        candidateDto.setJob(job);
        candidateDto.setCv(cv);
        candidateService.updateCandidate(id, candidateDto);
    }

    @GetMapping("/getDetailCandidate/{id}")
    public ResponseEntity<CandidateDtoResponse> getDetailCandidate(@PathVariable("id") String id) {
        return ResponseEntity.ok(candidateService.getDetailCandidate(Integer.parseInt(id)));
    }

    @GetMapping("/getListCandidate")
    public Page<CandidateDtoResponse> getListCandidate(@RequestParam String search,
                                                       @RequestParam int page, @RequestParam int size) {
        Page<CandidateDtoResponse> candidateDtoPage = candidateService.getListCandidate(search, page, size);
        return ResponseEntity.ok(candidateDtoPage).getBody();
    }

    @DeleteMapping("deleteCandidate/{id}")
    public void deleteCandidate(@PathVariable("id") Integer id) {
        candidateService.deleteCandidate(id);
    }

    @PostMapping("banCandidate/{id}")
    public ResponseEntity<Boolean> banCandidate (@PathVariable("id") int id, @RequestParam String status) {
        System.out.println(status);
        boolean response = candidateService.banCandidate(id, status);
        return ResponseEntity.ok(response);
    }
}