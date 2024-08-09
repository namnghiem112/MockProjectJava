package com.example.mockproject.Scheduler;

import com.example.mockproject.Entity.Offer;
import com.example.mockproject.Repository.OfferRepository;
import com.example.mockproject.Service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
@Component
public class OfferScheduler {
    @Autowired
    private OfferRepository offerRepository;
    @Autowired
    private MailService mailService;
    @Scheduled(cron = "0 0 8 * * ?")
    //@Scheduled(cron = "*/30 * * * * ?")
    public void sendActionOfferDaily() {
        List<Offer> offerList=offerRepository.findAll();
        for (Offer x:offerList){
            if(x.getStatus().toString().equalsIgnoreCase("WAITING_FOR_APPROVAL")&&x.getDueDate().after(new Date())){
                mailService.sendActionOffer(x);
            }
        }
    }
}
