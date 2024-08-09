package com.example.mockproject.Service;

import com.example.mockproject.Dto.JobDto;
import com.example.mockproject.Entity.num.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface JobService {
    List<JobDto> getAll();

    Page<JobDto> getListJob(Pageable pageable);

    Page<JobDto> getListJob(String title, JobStatus status, Pageable pageable);

    void save(JobDto jobDto);

    void delete(int id);

    JobDto getJobById(int id) throws ClassNotFoundException;

    void update(JobDto jobDto);
}
