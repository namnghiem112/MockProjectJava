package com.example.mockproject.Scheduler;

import com.example.mockproject.Dto.JobDto;
import com.example.mockproject.Entity.Job;
import com.example.mockproject.Entity.num.JobStatus;
import com.example.mockproject.Service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
public class StatusUpdater {

    @Autowired
    private JobService jobService;

    @Scheduled(cron = "0 0 0 * * ?") // Chạy vào nửa đêm mỗi ngày
    // @Scheduled(cron = "* * * * * *") // chạy mỗi giây
    public void updateJobStatus() {
        List<JobDto> jobs = jobService.getAll();
        Date currentDate = new Date();

        for (JobDto job : jobs) {
            if (job.getStartDate().compareTo(currentDate) > 0) {
                job.setStatus(JobStatus.DRAFTED);
            } else
            // Nếu ngày hiện tại bằng hoặc sau ngày bắt đầu và trước hoặc bằng ngày kết thúc
            // thì trạng thái là OPEN
            if (job.getStartDate().compareTo(currentDate) <= 0 && job.getEndDate().compareTo(currentDate) >= 0) {
                job.setStatus(JobStatus.OPEN);
            }
            // Nếu ngày hiện tại sau ngày kết thúc thì trạng thái là CLOSED
            else if (job.getEndDate().compareTo(currentDate) < 0) {
                job.setStatus(JobStatus.CLOSED);
            }
            jobService.save(job); // Cập nhật công việc trong cơ sở dữ liệu
        }
        System.out.println("Updated job statuses at " + currentDate);
    }
}
