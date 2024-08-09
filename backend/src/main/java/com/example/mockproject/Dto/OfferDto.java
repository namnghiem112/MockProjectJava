package com.example.mockproject.Dto;

import com.example.mockproject.Entity.Candidate;
import com.example.mockproject.Entity.Interview;
import com.example.mockproject.Entity.Job;
import com.example.mockproject.Entity.User;
import com.example.mockproject.Entity.num.*;
import lombok.Data;

import java.util.Date;

@Data
public class OfferDto {
    private int id;
    private ContractType contractType;
    private Position position;
    private String level;
    private Date contractStart;
    private Date contractEnd;
    private Department department;
    private Date dueDate;
    private Integer basicSalary;
    private String note;
    private OfferStatus status;
    private Interview interview;
    private String rejectNote;
    private User approver;
    private User recruiter;
    private Candidate candidateOffer;
    private Job job;
}
