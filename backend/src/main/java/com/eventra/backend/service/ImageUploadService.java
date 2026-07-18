package com.eventra.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageUploadService {

    private final Path uploadDirectory =
            Paths.get("uploads");

    public ImageUploadService() throws IOException {
        Files.createDirectories(uploadDirectory);
    }

    public String saveImage(MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please select an image"
            );
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !contentType.startsWith("image/")) {
            throw new IllegalArgumentException(
                    "Only image files are allowed"
            );
        }

        String originalFilename =
                file.getOriginalFilename();

        String extension = "";

        if (originalFilename != null &&
                originalFilename.contains(".")) {
            extension = originalFilename.substring(
                    originalFilename.lastIndexOf(".")
            );
        }

        String newFilename =
                UUID.randomUUID() + extension;

        Path destination =
                uploadDirectory.resolve(newFilename);

        Files.copy(
                file.getInputStream(),
                destination,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "/uploads/" + newFilename;
    }
}