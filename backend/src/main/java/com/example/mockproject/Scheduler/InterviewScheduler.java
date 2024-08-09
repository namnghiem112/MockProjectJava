package com.example.mockproject.Scheduler;

import com.example.mockproject.Dto.InterviewDto;
import com.example.mockproject.Entity.Interview;
import com.example.mockproject.Entity.InterviewerInterview;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Entity.num.InterviewStatus;
import com.example.mockproject.Repository.InterviewRepository;
import com.example.mockproject.Service.InterviewService;
import com.example.mockproject.Service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Component
public class InterviewScheduler {
    @Autowired
    private MailService mailService;
    @Autowired
    private InterviewRepository interviewRepository;

    @Scheduled(cron = "0 0 20 * * ?")
    public void remindInterview(){
        List<Interview> interviews = interviewRepository.findAll();
        for (Interview interview : interviews) {
            if (interview.getStatus() != InterviewStatus.INTERVIEWED && interview.getStatus() != InterviewStatus.CANCELLED && interview.getStatus() != InterviewStatus.REMINDED) {
                if (dateDiff(interview.getDate()) <= 2 && dateDiff(interview.getDate()) > 0) {
                    interview.setStatus(InterviewStatus.REMINDED);
                    interviewRepository.save(interview);
                    mailService.sendRemindEmail(convertToDto(interview));
                }
            }
        }
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

    public static String convertDate(Date date) {
        // Create a SimpleDateFormat instance with the desired format
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        // Format the date and return as a string
        return formatter.format(date);
    }

    public int dateDiff(Date interviewDate) {
//        System.out.println(interviewDate);
        LocalDate interviewLocalDate = new java.sql.Date(interviewDate.getTime()).toLocalDate();
        LocalDate currentDate = LocalDate.now();
//        System.out.println(currentDate);

        // Calculate date difference
        Period period = Period.between(currentDate, interviewLocalDate);

        // Format the difference as a string
        int days = period.getDays();
//        System.out.println(days);
        return days;
    }
}
