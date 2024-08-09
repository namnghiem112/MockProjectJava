package com.example.mockproject.Service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileService {
    public void addCv(MultipartFile file, List<Integer> jobs);
}
