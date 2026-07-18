package com.eventra.backend.controller;

import com.eventra.backend.service.ImageUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageUploadController {

    private final ImageUploadService imageUploadService;

    public ImageUploadController(ImageUploadService imageUploadService) {
        this.imageUploadService = imageUploadService;
    }

    @PostMapping
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile image
    ) {

        try {

            String imageUrl = imageUploadService.saveImage(image);

            return ResponseEntity.ok(
                    Map.of(
                            "imageUrl",
                            imageUrl,
                            "message",
                            "Image uploaded successfully."
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", e.getMessage())
            );

        } catch (IOException e) {

            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "message",
                            "Failed to upload image."
                    )
            );
        }
    }
}