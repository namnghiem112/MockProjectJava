package com.example.mockproject.Service.Impl;

import com.example.mockproject.Dto.InterviewDto;
import com.example.mockproject.Entity.Candidate;
import com.example.mockproject.Entity.Interview;
import com.example.mockproject.Entity.InterviewerInterview;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Entity.num.CandidateStatus;
import com.example.mockproject.Entity.num.InterviewResult;
import com.example.mockproject.Entity.num.InterviewStatus;
import com.example.mockproject.Repository.CandidateRepository;
import com.example.mockproject.Repository.InterviewRepository;
import com.example.mockproject.Repository.InterviewerInterviewRepository;
import com.example.mockproject.Repository.UserRepository;
import com.example.mockproject.Service.CandidateService;
import com.example.mockproject.Service.InterviewService;
import com.example.mockproject.Service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Array;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.regex.Pattern;

@Service
public class InterviewServiceImpl implements InterviewService {
    @Autowired
    private InterviewRepository interviewRepository;
    @Autowired
    private InterviewerInterviewRepository interviewerInterviewRepository;
    @Autowired
    private MailService mailService;
    @Autowired
    private CandidateRepository candidateRepository;
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    @Override
    public Page<InterviewDto> getInterviews(String search, InterviewStatus status, int page, int size, int interviewerId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Interview> interviews = null;
        if (status == null && interviewerId == 0) interviews = interviewRepository.findAll(search, pageable);
        else if (status == null) interviews = interviewRepository.findInterviewsByInterviewerId(search, interviewerId, pageable);
        else if (interviewerId == 0) interviews = interviewRepository.findAllByStatus(search, pageable, status);
        else interviews = interviewRepository.findInterviewsByInterviewerIdAndStatus(search, interviewerId, pageable, status);
        return interviews.map(this::convertToDto);
    }

    private InterviewDto convertToDto(Interview interview) {
        InterviewDto dto = new InterviewDto();
        dto.setId(interview.getId());
        dto.setTitle(interview.getTitle());
        dto.setDate(interview.getDate());
        dto.setLocation(interview.getLocation());
        dto.setTimeStart(interview.getTimeStart().toString());
        dto.setTimeEnd(interview.getTimeEnd().toString());
        dto.setResult(interview.getResult());
        dto.setNote(interview.getNote());
        dto.setStatus(interview.getStatus());
        dto.setMeetingLink(interview.getMeetingLink());
        dto.setJob(interview.getJob());
        dto.setCandidate(interview.getCandidate());
        dto.setScore(interview.getScore());
        dto.setInterviewerNote(interview.getInterviewerNote());
        User rec = interview.getRecruiter();
        rec.setPassword(null);
        dto.setRecruiter(rec);
        List<InterviewerInterview> tmp = interview.getInterviewers();
        List<User> interviewers = new ArrayList<>();
        tmp.forEach(user -> {
            User user1 = user.getInterviewerId();
            user1.setPassword(null);
            interviewers.add(user1);
        });
        dto.setInterviewers(new ArrayList<>(interviewers));
        return dto;
    }

    public boolean isInterviewerBusy(int interviewerId, Date date, Date startTime, Date endTime) {
        List<Interview> conflictingInterviews = interviewRepository.findConflictingInterviews(interviewerId, date, startTime, endTime, InterviewStatus.INTERVIEWED, InterviewStatus.CANCELLED);
        return !conflictingInterviews.isEmpty();
    }

    @Override
    public void createInterview(InterviewDto interviewDto) throws Exception{
        if (interviewDto.getTitle() == null || interviewDto.getDate() == null || interviewDto.getCandidate() == null || interviewDto.getTimeStart() == null
        || interviewDto.getTimeEnd() == null || interviewDto.getRecruiter() == null || interviewDto.getJob() == null){
            throw new Exception("Null exception");
        }
        Interview interview = new Interview();
        interview.setTitle(interviewDto.getTitle());
        interview.setDate(interviewDto.getDate());
        interview.setLocation(interviewDto.getLocation());
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        try {
            String HH_MM_PATTERN = "^([01]\\d|2[0-3]):([0-5]\\d)$";
            Pattern HH_MM_REGEX = Pattern.compile(HH_MM_PATTERN);
            if (HH_MM_REGEX.matcher(interviewDto.getTimeStart()).matches()) interviewDto.setTimeStart(interviewDto.getTimeStart() + ":00");
            if (HH_MM_REGEX.matcher(interviewDto.getTimeEnd()).matches()) interviewDto.setTimeEnd(interviewDto.getTimeEnd() + ":00");
            Date timeStart = sdf.parse(interviewDto.getTimeStart());
            Date timeEnd = sdf.parse(interviewDto.getTimeEnd());
            interview.setTimeStart(timeStart);
            interview.setTimeEnd(timeEnd);
        } catch (ParseException e) {
            throw new RuntimeException("Error in parsing date and time");
        }
        interview.setResult(interviewDto.getResult());
        interview.setNote(interviewDto.getNote());
        interview.setStatus(interviewDto.getStatus());
        interview.setMeetingLink(interviewDto.getMeetingLink());
        interview.setJob(interviewDto.getJob());
        interview.setCandidate(interviewDto.getCandidate());
        interview.setRecruiter(interviewDto.getRecruiter());
        for (User interviewer : interviewDto.getInterviewers()) {
            boolean isBusy = isInterviewerBusy(interviewer.getId(), interview.getDate(), interview.getTimeStart(), interview.getTimeEnd());
            if (isBusy) {
                throw new RuntimeException("Interviewer " + interviewer.getFullname() + " is busy at the given time.");
            }
        }
        try{
            Interview interview1 = interviewRepository.save(interview);
            if (interview1 != null && interview1.getId() != 0){
                interviewDto.setId(interview1.getId());
                List<User> interviewers = interviewDto.getInterviewers();
                interviewers.forEach(interviewer -> {
                    InterviewerInterview interviewerInterview = new InterviewerInterview();
                    interviewerInterview.setInterviewId(interview1);
                    interviewerInterview.setInterviewerId(interviewer);
                    interviewerInterviewRepository.save(interviewerInterview);
                });
            }
            else throw new Exception("Create error");
        } catch (Exception e){
            throw new Exception("Error in saving interview");
        }
        interviewDto.getCandidate().setStatus(CandidateStatus.WAITING_FOR_INTERVIEW);
        try {
            candidateRepository.save(interviewDto.getCandidate());
        } catch (Exception e) {
            throw new Exception("Update candidate status error");
        }
            executorService.submit(() -> {
                try{
                    mailService.sendCandidate(interviewDto);
                    mailService.sendInterviewer(interviewDto);
                    interviewDto.setStatus(InterviewStatus.INVITED);
                    editInterview(interviewDto);
                } catch (Exception e){
                    throw new RuntimeException("Error in sending invitation");
                }
            });


    }

    @Override
    public InterviewDto getInterview(int id){
        Optional<Interview> res = interviewRepository.findById(id);
        return res.map(this::convertToDto).orElse(null);
    }

    @Override
    public void editInterview(InterviewDto interviewDto) throws Exception{
        if (interviewDto.getTitle() == null || interviewDto.getDate() == null || interviewDto.getCandidate() == null || interviewDto.getTimeStart() == null
                || interviewDto.getTimeEnd() == null || interviewDto.getRecruiter() == null || interviewDto.getJob() == null){
            throw new Exception("Null exception");
        }
        Interview interview = new Interview();
        interview.setId(interviewDto.getId());
        interview.setTitle(interviewDto.getTitle());
        interview.setDate(interviewDto.getDate());
        interview.setLocation(interviewDto.getLocation());
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        try {
            String HH_MM_PATTERN = "^([01]\\d|2[0-3]):([0-5]\\d)$";
            Pattern HH_MM_REGEX = Pattern.compile(HH_MM_PATTERN);
            if (HH_MM_REGEX.matcher(interviewDto.getTimeStart()).matches()) interviewDto.setTimeStart(interviewDto.getTimeStart() + ":00");
            if (HH_MM_REGEX.matcher(interviewDto.getTimeEnd()).matches()) interviewDto.setTimeEnd(interviewDto.getTimeEnd() + ":00");
            Date timeStart = sdf.parse(interviewDto.getTimeStart());
            Date timeEnd = sdf.parse(interviewDto.getTimeEnd());
            interview.setTimeStart(timeStart);
            interview.setTimeEnd(timeEnd);
        } catch (ParseException e) {
            throw new RuntimeException("Error in parsing date and time");
        }
        interview.setResult(interviewDto.getResult());
        interview.setNote(interviewDto.getNote());
        interview.setStatus(interviewDto.getStatus());
        interview.setMeetingLink(interviewDto.getMeetingLink());
        interview.setJob(interviewDto.getJob());
        interview.setCandidate(interviewDto.getCandidate());
        interview.setRecruiter(interviewDto.getRecruiter());
        interview.setScore(interviewDto.getScore());
        interview.setInterviewerNote(interviewDto.getInterviewerNote());
        Interview old = interviewRepository.findById(interviewDto.getId()).get();
        Interview interview1 = interviewRepository.save(interview);
        Interview new1 = interviewRepository.findById(interviewDto.getId()).get();
//        System.out.println(interview.getDate());
//        System.out.println(old.getDate());
        List<User> interviewers = interviewDto.getInterviewers();
        interviewerInterviewRepository.deleteInterview(interview1);
        interviewers.forEach(interviewer -> {
            InterviewerInterview interviewerInterview = new InterviewerInterview();
            interviewerInterview.setInterviewId(interview1);
            interviewerInterview.setInterviewerId(interviewer);
            interviewerInterviewRepository.save(interviewerInterview);
        });
        if (!old.getDate().equals(new1.getDate())
                || !old.getLocation().equals(new1.getLocation())
                || !old.getTimeStart().equals(new1.getTimeStart())
                || !old.getTimeEnd().equals(new1.getTimeEnd())
                || !old.getMeetingLink().equals(new1.getMeetingLink())){
            mailService.sendEditEmail(interviewDto);
        }
        if (old.getResult() != interviewDto.getResult()){
            InterviewResult result = interviewDto.getResult();
            if (result == InterviewResult.PASSED) interviewDto.getCandidate().setStatus(CandidateStatus.PASSED_INTERVIEW);
            else if (result == InterviewResult.FAILED) interviewDto.getCandidate().setStatus(CandidateStatus.FAILED_INTERVIEW);
            try{
                candidateRepository.save(interviewDto.getCandidate());
            } catch (Exception e){
                throw new Exception("Update candidate status error");
            }
        }
    }

    @Override
    public void submitResult(InterviewDto interviewDto) throws Exception{
        try{
            InterviewResult result = interviewDto.getResult();
            interviewRepository.submitResult(interviewDto.getId(), interviewDto.getNote(), result, interviewDto.getScore(), interviewDto.getInterviewerNote());
            Candidate candidate = interviewDto.getCandidate();
            if (result == InterviewResult.PASSED) candidate.setStatus(CandidateStatus.PASSED_INTERVIEW);
            else if (result == InterviewResult.FAILED) candidate.setStatus(CandidateStatus.FAILED_INTERVIEW);
            try{
                candidateRepository.save(candidate);
            } catch (Exception e){
                e.printStackTrace();
                throw new Exception("Update candidate status error");
            }
        } catch (Exception e){
            e.printStackTrace();
            throw new Exception("Submit result error");
        }
    }
}
