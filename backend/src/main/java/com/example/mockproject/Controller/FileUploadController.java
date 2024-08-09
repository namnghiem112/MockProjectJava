package com.example.mockproject.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/upload/")
public class FileUploadController {
    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/cv")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("email") String email,
            @RequestParam("jobs") String jobsString) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        List<Integer> jobs = Arrays.stream(jobsString.split(","))
                .map(Integer::parseInt)
                .collect(Collectors.toList());

        try {
            byte[] bytes = file.getBytes();
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filenameWithoutExtension = originalFilename.substring(0, originalFilename.lastIndexOf("."));

            // Combine original filename with email
            String newFileName = filenameWithoutExtension + "-" + email + fileExtension;

            List<String> savedPaths = new ArrayList<>();

            for (Integer jobId : jobs) {
                String jobFolder = "job_" + jobId;
                Path jobPath = Paths.get(uploadDir, jobFolder);
                Files.createDirectories(jobPath);

                Path filePath = jobPath.resolve(newFileName);
                Files.write(filePath, bytes);
                savedPaths.add(filePath.toString());

                logger.info("File saved to: " + filePath);
            }

            return ResponseEntity.ok("Files uploaded successfully to: " + String.join(", ", savedPaths));
        } catch (IOException e) {
            logger.error("Failed to upload file", e);
            return ResponseEntity.internalServerError().body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/cv/files")
    public ResponseEntity<List<String>> getAllCVFiles() {
        Path cvPath = Paths.get(uploadDir);
        Set<String> uniqueFileNames = new HashSet<>();

        try (Stream<Path> walk = Files.walk(cvPath)) {
            walk.filter(Files::isRegularFile)
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .forEach(fileName -> uniqueFileNames.add(fileName));

            List<String> fileNames = new ArrayList<>(uniqueFileNames);
            Collections.sort(fileNames); // Optional: sort the list alphabetically

            return ResponseEntity.ok(fileNames);
        } catch (IOException e) {
            logger.error("Failed to retrieve CV files", e);
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/cv/file/{fileName}")
    public ResponseEntity<?> getFile(@PathVariable String fileName) {
        try {
            Path rootPath = Paths.get(uploadDir);
            List<FileInfo> fileInfos = findFiles(rootPath, fileName);

            if (!fileInfos.isEmpty()) {
                FileInfo fileInfo = fileInfos.get(0);  // Get the first file found
                Resource resource = new UrlResource(fileInfo.getPath().toUri());
                if (resource.exists() || resource.isReadable()) {
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                            .header(HttpHeaders.CONTENT_TYPE, Files.probeContentType(fileInfo.getPath()))
                            .body(resource);
                }
            }
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            logger.error("Error retrieving file: " + fileName, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/cv/file/info/{fileName}")
    public ResponseEntity<List<String>> getFileInfo(@PathVariable String fileName) {
        try {
            Path rootPath = Paths.get(uploadDir);
            List<String> jobNumbers = findJobNumbersForFile(rootPath, fileName);

            if (!jobNumbers.isEmpty()) {
                return ResponseEntity.ok(jobNumbers);
            }
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            logger.error("Error retrieving file info: " + fileName, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    private List<String> findJobNumbersForFile(Path rootPath, String fileName) throws IOException {
        List<String> jobNumbers = new ArrayList<>();
        try (Stream<Path> walkStream = Files.walk(rootPath)) {
            walkStream
                    .filter(p -> Files.isRegularFile(p) && p.getFileName().toString().equals(fileName))
                    .forEach(p -> {
                        jobNumbers.add(extractJobNumber(new FileInfo(p, rootPath.relativize(p.getParent()))));
                        logger.info("Checking file: " + p.toString()); // Debug log
                    });
        }
        if (!jobNumbers.isEmpty()) {
            logger.info("Job numbers found: " + jobNumbers.toString()); // Debug log

        }
        return jobNumbers;
    }

    private String extractJobNumber(FileInfo fileInfo) {
        Path relativePath = fileInfo.getRelativeFolder();
        logger.info("Processing folder: " + relativePath.toString());

        // Since relativePath is the parent folder of the file, we should check the parent folder name.
        if (relativePath.getNameCount() > 0) {
            Path jobFolder = relativePath.getName(0); // Get the job folder name
            logger.info("Job folder name: " + jobFolder.toString());
            if (jobFolder.toString().startsWith("job_")) {
                String jobNumber = jobFolder.toString().substring(4); // Extract the number part after "job_"
                logger.info("Extracted job number: " + jobNumber);
                return jobNumber;
            }
        }
        logger.warn("No valid job number found for: " + relativePath.toString());
        return null;
    }


    private List<FileInfo> findFiles(Path rootPath, String fileName) throws IOException {
        try (Stream<Path> walkStream = Files.walk(rootPath)) {
            return walkStream
                    .filter(p -> p.getFileName().toString().equals(fileName))
                    .map(p -> new FileInfo(p, rootPath.relativize(p.getParent())))
                    .collect(Collectors.toList());
        }
    }

    private static class FileInfo {
        private Path path;
        private Path relativeFolder;

        public FileInfo(Path path, Path relativeFolder) {
            this.path = path;
            this.relativeFolder = relativeFolder;
        }

        public Path getPath() {
            return path;
        }

        public Path getRelativeFolder() {
            return relativeFolder;
        }
    }

}