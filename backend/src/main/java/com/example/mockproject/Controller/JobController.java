package com.example.mockproject.Controller;

import com.example.mockproject.Dto.JobDto;
import com.example.mockproject.Entity.num.JobStatus;
import com.example.mockproject.Service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/job")
public class JobController {
    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<Page<JobDto>> getJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<JobDto> jobPage;
        JobStatus jobStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                jobStatus = JobStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build(); // Invalid status value
            }
        }

        if ((title == null || title.isEmpty()) && jobStatus == null) {
            jobPage = jobService.getListJob(pageable);
        } else {
            jobPage = jobService.getListJob(title, jobStatus, pageable);
        }
        return ResponseEntity.ok(jobPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable int id) throws ClassNotFoundException {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping("/save")
    public ResponseEntity<JobDto> addJob(@RequestBody JobDto jobDto) {
        jobService.save(jobDto);
        return ResponseEntity.ok(jobDto);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<JobDto> updateJob(@RequestBody JobDto jobDto, @PathVariable int id) {
        jobDto.setId(id);
        jobService.update(jobDto);
        return ResponseEntity.ok(jobDto);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable int id) throws ClassNotFoundException {
        JobDto jobDto = jobService.getJobById(id);
        jobDto.setChecked(false);
        jobService.save(jobDto);
        return ResponseEntity.ok().build();
    }
}
