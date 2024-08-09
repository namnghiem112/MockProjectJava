package com.example.mockproject.Service;

import com.example.mockproject.Dto.InterviewDto;
import com.example.mockproject.Dto.OfferDto;
import com.example.mockproject.Entity.Interview;
import com.example.mockproject.Entity.Offer;

public interface MailService {
    void sendMailUpdatePassword(String verifyKey, String mailTo);
    void sendAccountCreatedEmail(String to, String username, String password, String recruiterEmail);
    void sendCandidate(InterviewDto interview);
    void sendInterviewer(InterviewDto interview);
    void sendRemindEmail(InterviewDto interview);
    void sendEditEmail(InterviewDto interview);
    void sendCancelEmail(InterviewDto interview);
    void sendActionOffer(Offer Offer);

}
