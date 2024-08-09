package com.example.mockproject.Service;

import com.example.mockproject.Dto.InterviewDto;
import com.example.mockproject.Entity.Interview;
import com.example.mockproject.Entity.num.InterviewResult;
import com.example.mockproject.Entity.num.InterviewStatus;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface InterviewService {
    Page<InterviewDto> getInterviews(String search, InterviewStatus status, int page, int size, int interviewerId);
    void createInterview(InterviewDto interviewDto) throws Exception;
    InterviewDto getInterview(int id);
    void editInterview(InterviewDto interviewDto) throws Exception;
    void submitResult(InterviewDto interviewDto) throws Exception;
}
