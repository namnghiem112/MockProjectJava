package com.example.mockproject.Dto;

import com.example.mockproject.Entity.num.JobStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class JobDto {
    private int id;
    private String title;
    private Date createdDate;
    private Date startDate;
    private Date endDate;
    private String level;
    private JobStatus status;
    private String skill;
    private String benefits;
    private String workingAddress;
    private Integer salaryRangeFrom;
    private Integer salaryRangeTo;
    private String description;
    private boolean checked;
}
