package com.example.mockproject.Service.Impl;

import com.example.mockproject.Dto.JobDto;
import com.example.mockproject.Entity.Job;
import com.example.mockproject.Entity.num.JobStatus;
import com.example.mockproject.Repository.JobRepository;
import com.example.mockproject.Service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {
    @Autowired
    private JobRepository jobRepository;

    public JobDto convertToDto(Job job) {
        ModelMapper modelMapper = new ModelMapper();
        JobDto jobDto = modelMapper.map(job, JobDto.class);
        return jobDto;
    }

    @Override
    public List<JobDto> getAll() {
        List<Job> jobs = jobRepository.findAll();
        List<JobDto> jobDtos = jobs.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return jobDtos;
    }

    @Override
    public Page<JobDto> getListJob(Pageable pageable) {
        Page<Job> jobPage = jobRepository.findAll(pageable);
        List<JobDto> jobDtoPage = jobPage.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new PageImpl<>(jobDtoPage, pageable, jobPage.getTotalElements());
    }

    @Override
    public Page<JobDto> getListJob(String title, JobStatus status, Pageable pageable) {
        Page<Job> jobPage = jobRepository.findSearchAll(title, status, pageable);
        List<JobDto> jobDtoPage = jobPage.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new PageImpl<>(jobDtoPage, pageable, jobPage.getTotalElements());
    }

    @Override
    public void save(JobDto jobDto) {
        ModelMapper modelMapper = new ModelMapper();
        Job job = modelMapper.map(jobDto, Job.class);
        System.out.println(jobDto);
        System.out.println(job);
        jobRepository.save(job);
    }

    @Override
    public void delete(int id) {
        jobRepository.deleteById(id);
    }

    @Override
    public JobDto getJobById(int id) throws ClassNotFoundException {
        Optional<Job> optionalJob = jobRepository.findById(id);

        if (optionalJob.isPresent()) {
            Job job = optionalJob.get();
            ModelMapper modelMapper = new ModelMapper();
            JobDto jobDto = modelMapper.map(job, JobDto.class);
            return jobDto;
        } else {
            // Xử lý trường hợp không tìm thấy Job
            throw new ClassNotFoundException("Job with ID " + id + " not found");
        }
    }

    @Override
    public void update(JobDto jobDto) {
        ModelMapper modelMapper = new ModelMapper();
        Job job = modelMapper.map(jobDto, Job.class);
        jobRepository.save(job);
    }
}
