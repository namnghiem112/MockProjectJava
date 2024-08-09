package com.example.mockproject.Service.Impl;

import com.example.mockproject.Dto.InterviewDto;
import com.example.mockproject.Entity.Offer;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class MailServiceImpl implements MailService {
    @Autowired
    private JavaMailSender mailSender;
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);
    @Override
    public void sendMailUpdatePassword(String verifyKey, String mailTo) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            String link = "http://localhost:8080/resetpassword" + "?verifyKey=" + verifyKey;
            helper.setTo(mailTo);
            helper.setSubject("Confirm your email");
            String htmlContent = "<html>" + "<body>" + "Xin chào," + "<br><br>"
                    + "<input type=\"hidden\" th:value=\"${redirectUri}\" id=\"redirectUriTh\">"
                    + "<input type=\"hidden\" id=\"verifyKey\" value=\"" + verifyKey + "\">"
                    + "Nhấp vào nút bên dưới để đổi mật khẩu:" + "<br><br>" + "<a href=\""
                    + link + "\">"
                    + "<button id=\"nga\" style=\"background-color:blue; color:white; padding: 10px;\">Đổi mật khẩu</button>" + "</a>"
                    + "</body>" + "</html>";
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendAccountCreatedEmail(String to, String username, String password, String recruiterEmail) {
        String subject = "No-reply-email-IMS-system <Account created>";
        String body = String.format("This email is from IMS system,\n\n" +
                "Your account has been created. Please use the following credential to login:\n\n" +
                "• Username: %s\n" +
                "• Password: %s\n\n" +
                "If anything wrong, please reach out to recruiter: %s. We are so sorry for this inconvenience.\n\n" +
                "Thanks & Regards!\n" +
                "IMS Team.", username, password, recruiterEmail);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    @Override
    public void sendCandidate(InterviewDto interview){
        String subject = "No-reply-email-IMS-system <Interview Invitation>";
        String body = String.format("This email is from IMS system,\n\n" +
                "You are invited to an interview:\n\n" +
                "• Job: %s\n" +
                "• Date: %s - %s %s\n" +
                "• Location: %s\n" +
                "• Meeting link (for online interview): %s\n" +
                "If you have any questions, please reach out to this email: %s (%s) \n" +
                "Thanks & Regards!\n" +
                "IMS Team.", interview.getJob().getTitle(), interview.getTimeStart(), interview.getTimeEnd(), convertDate(interview.getDate()), interview.getLocation(), interview.getMeetingLink(), interview.getRecruiter().getEmail(), interview.getRecruiter().getFullname());
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(interview.getCandidate().getEmail());
        message.setSubject(subject);
        message.setText(body);
        executorService.submit(() -> mailSender.send(message));
    }

    @Override
    public void sendInterviewer(InterviewDto interview){
        String subject = "No-reply-email-IMS-system <New Interview Schedule>";
        String body = String.format("This email is from IMS system,\n\n" +
                "You have a new interview schedule:\n\n" +
                "• Job: %s\n" +
                "• Candidate: %s\n" +
                "• Date: %s - %s %s\n" +
                "• Location: %s\n" +
                "• Meeting link (for online interview): %s\n\n" +
                "If you have any questions, please reach out to this email: %s (%s) \n" +
                "Thanks & Regards!\n" +
                "IMS Team.", interview.getJob().getTitle(), interview.getCandidate().getName(), convertTime(interview.getTimeStart()), convertTime(interview.getTimeEnd()), convertDate(interview.getDate()), interview.getLocation(), interview.getMeetingLink(), interview.getRecruiter().getEmail(), interview.getRecruiter().getFullname());
        for (User i: interview.getInterviewers()){
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(i.getEmail());
            message.setSubject(subject);
            message.setText(body);
            executorService.submit(() -> mailSender.send(message));
        }
    }

    @Override
    public void sendRemindEmail(InterviewDto interview){
        String subject = "No-reply-email-IMS-system <Interview Reminder>";
        String body = String.format("This email is from IMS system,\n\n" +
                "Don't forget you're having an interview in %s:\n\n" +
                "• Job: %s\n" +
                "• Date: %s - %s %s\n" +
                "• Location: %s\n" +
                "• Meeting link (for online interview): %s\n" +
                "If you have any questions, please reach out to this email: %s (%s) \n" +
                "Thanks & Regards!\n" +
                "IMS Team.", dateDiff(interview.getDate()), interview.getJob().getTitle(), convertTime(interview.getTimeStart()), convertTime(interview.getTimeEnd()), convertDate(interview.getDate()), interview.getLocation(), interview.getMeetingLink(), interview.getRecruiter().getEmail(), interview.getRecruiter().getFullname());
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(interview.getCandidate().getEmail());
        message.setSubject(subject);
        message.setText(body);
        executorService.submit(() -> mailSender.send(message));
    }

    @Override
    public void sendEditEmail(InterviewDto interview){
        String subject = "No-reply-email-IMS-system <Interview Update>";
        String body = String.format("This email is from IMS system,\n\n" +
                "Due to specific reasons, we have to modify the schedule for your upcoming interview:\n\n" +
                "• Job: %s\n" +
                "• Date: %s - %s %s\n" +
                "• Location: %s\n" +
                "• Meeting link (for online interview): %s\n" +
                "We're sorry for the inconvenience. If you have any questions, please reach out to this email: %s (%s) \n" +
                "Thanks & Regards!\n" +
                "IMS Team.", interview.getJob().getTitle(), convertTime(interview.getTimeStart()), convertTime(interview.getTimeEnd()), convertDate(interview.getDate()), interview.getLocation(), interview.getMeetingLink(), interview.getRecruiter().getEmail(), interview.getRecruiter().getFullname());
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(interview.getCandidate().getEmail());
        message.setSubject(subject);
        message.setText(body);
        executorService.submit(() -> mailSender.send(message));
    }

    @Override
    public void sendCancelEmail(InterviewDto interview){
        String subject = "No-reply-email-IMS-system <Interview Cancellation>";
        String body = String.format("This email is from IMS system,\n\n" +
                "Due to specific reasons, we have to cancel your upcoming interview for job &s on %s for :\n\n" +
                "We'll keep your application on file. Thank you for your time preparing for this interview \n" +
                "We wish you the best of luck with your job search \n\n" +
                "If you have any questions, please reach out to this email: %s (%s) \n" +
                "Thanks & Regards!\n" +
                "IMS Team.", interview.getJob().getTitle(), convertDate(interview.getDate()), interview.getRecruiter().getEmail(), interview.getRecruiter().getFullname());
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(interview.getCandidate().getEmail());
        message.setSubject(subject);
        message.setText(body);
        executorService.submit(() -> mailSender.send(message));
    }

    @Override
    public void sendActionOffer(Offer offer) {
        String url = "http://127.0.0.1:5501/offer/viewdetailoffer.html?id=" + offer.getId();
        String subject = "No-reply-email-IMS-system <Take action on Job offer>";
        String body = String.format(
                "<html>" +
                        "<body>" +
                        "This email is from IMS system,<br><br>" +
                        "You have an offer to take action for Candidate %s<br>" +
                        "Position: %s before %s.<br>" +
                        "The contract is attached with this no-reply-email.<br>" +
                        "Please refer to this link to take action: <br><br>" +
                        "<a href=\"%s\" style=\"background-color:blue;color:white;padding:10px;text-decoration:none;border-radius:5px;\">Take Action</a><br><br>" +
                        "If anything is wrong, please reach out to recruiter: %s.<br>" +
                        "We are so sorry for this inconvenience.<br><br>" +
                        "Thanks & Regards!<br>" +
                        "IMS Team." +
                        "</body>" +
                        "</html>",
                offer.getCandidateOffer().getName(),
                offer.getPosition(),
                offer.getDueDate(),
                url,
                offer.getRecruiter().getUsername()
        );
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(offer.getApprover().getEmail());
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public static String convertDate(Date date) {
        // Create a SimpleDateFormat instance with the desired format
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        // Format the date and return as a string
        return formatter.format(date);
    }

    public static String convertTime(String time) {
        // Define the input and output time formats
        DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("HH:mm");

        // Parse the input time string to a LocalTime object
        LocalTime localTime = LocalTime.parse(time, inputFormatter);

        // Format the LocalTime object to the desired output format
        return localTime.format(outputFormatter);
    }

    public String dateDiff(Date interviewDate) {
//        System.out.println(interviewDate);
        LocalDate interviewLocalDate = new java.sql.Date(interviewDate.getTime()).toLocalDate();
        LocalDate currentDate = LocalDate.now();

        // Calculate date difference
        Period period = Period.between(currentDate, interviewLocalDate);

        // Format the difference as a string
        int days = period.getDays();
        if (days == 0) {
            return "today";
        } else if (days == 1) {
            return "1 day";
        } else {
            return days + " days";
        }
    }
}
