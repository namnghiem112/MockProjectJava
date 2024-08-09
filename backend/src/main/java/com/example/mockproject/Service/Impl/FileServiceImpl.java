package com.example.mockproject.Service.Impl;

import com.example.mockproject.Service.FileService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class FileServiceImpl implements FileService {
    @Override
    public void addCv(MultipartFile file, List<Integer> jobs) {
//        try {
//            Path root = Paths.get("back/src/main/resources/CV");
//            String originalFileName = file.getOriginalFilename();
//            int dotIndex = originalFileName.lastIndexOf(".");
//            String fileExtension = originalFileName.substring(dotIndex, originalFileName.length());
//            String newFileName = bookCode + fileExtension;
//            System.out.println(newFileName);
////			String directoryPath = "./src/main/resources/assets/images/";
//            Files.copy(file.getInputStream(), root.resolve(newFileName));
//        } catch (IOException e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
    }
}
