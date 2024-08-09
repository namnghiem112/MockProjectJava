package com.example.mockproject.Controller;

import com.example.mockproject.Dto.DataResponse;
import com.example.mockproject.Dto.InterviewDto;
import com.example.mockproject.Entity.Interview;
import com.example.mockproject.Entity.num.InterviewResult;
import com.example.mockproject.Entity.num.InterviewStatus;
import com.example.mockproject.Repository.InterviewRepository;
import com.example.mockproject.Service.InterviewService;
import com.example.mockproject.Service.MailService;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/interview")
public class InterviewController {
    @Autowired
    private InterviewService interviewService;
    @Autowired
    private InterviewRepository interviewRepository;
    @Autowired
    private MailService mailService;

    @GetMapping("/get")
    private Page<InterviewDto> getInterviews(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false) InterviewStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "0") int interviewerId
    )
    {
        return interviewService.getInterviews(search, status, page, size, interviewerId);
    }

    @PostMapping("/create")
    private ResponseEntity<?> createInterview(@RequestBody InterviewDto interviewDto) {
        DataResponse resp = new DataResponse();
        try{
            interviewService.createInterview(interviewDto);
        } catch (Exception e){
            resp.setMessage(e.getMessage());
            resp.setStatus("ME021");
            return ResponseEntity.badRequest().body(resp);
        }
        resp.setStatus("ME022");
        return ResponseEntity.ok(resp);
    }

//    @PostMapping("/create/email")
//    private ResponseEntity<?> createInterviewEmail(@RequestBody InterviewDto interviewDto) {
//        DataResponse resp = new DataResponse();
//        try{
//            mailService.sendCandidate(interviewDto);
//            mailService.sendInterviewer(interviewDto);
//            interviewDto.setStatus(InterviewStatus.INVITED);
//            interviewService.editInterview(interviewDto);
//        } catch (Exception e) {
//            resp.setMessage("Error sending email");
//            return ResponseEntity.badRequest().body(resp);
//        }
//        return ResponseEntity.ok(resp);
//    }

    @PutMapping("/edit")
    private ResponseEntity<?> editInterview(@RequestBody InterviewDto interviewDto) {
        DataResponse resp= new DataResponse();
        try{
            interviewService.editInterview(interviewDto);
        } catch (Exception e){
            resp.setMessage(e.getMessage());
            resp.setStatus("ME021");
            return ResponseEntity.badRequest().body(resp);
        }
        resp.setStatus("ME022");
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/get/{id}")
    private ResponseEntity<?> findInterviewById(@PathVariable int id) {
        InterviewDto interviewDto = interviewService.getInterview(id);
        if (interviewDto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(interviewDto);
    }

    @PutMapping("/submit")
    private ResponseEntity<?> submitResult(@RequestBody InterviewDto interviewDto) {
        DataResponse resp= new DataResponse();
        try{
            interviewService.submitResult(interviewDto);
        } catch (Exception e){
            resp.setMessage(e.getMessage());
            resp.setStatus("ME021");
            return ResponseEntity.badRequest().body(resp);
        }
        resp.setStatus("ME022");
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/remind/{id}")
    private ResponseEntity<?> remindInterview(@PathVariable int id) {
        DataResponse resp= new DataResponse();
        InterviewDto interviewDto = interviewService.getInterview(id);
        if (interviewDto == null) {
            resp.setMessage("No interview found");
            return ResponseEntity.badRequest().body(resp);
        }
        else if (interviewDto.getStatus() == InterviewStatus.INTERVIEWED || interviewDto.getStatus() == InterviewStatus.CANCELLED){
            resp.setMessage("Interview is cancelled or interviewed");
            return ResponseEntity.badRequest().body(resp);
        }
        mailService.sendRemindEmail(interviewDto);
        interviewDto.setStatus(InterviewStatus.REMINDED);
        try{
            interviewService.editInterview(interviewDto);
        } catch (Exception e){
            resp.setMessage("Error editing status to Reminded");
            return ResponseEntity.badRequest().body(resp);
        }
        resp.setMessage("Interview reminded successfully");
        resp.setStatus("OK");
        return ResponseEntity.ok(resp);
    }

}
