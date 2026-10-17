package com.ahmedesawy.floria.vector;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/vector")
@RequiredArgsConstructor
public class VectorAdminController {

    private final VectorIndexService vectorIndexService;

    @PostMapping("/reindex")
    public ResponseEntity<String> reindex() {
        vectorIndexService.reindexAll();
        return ResponseEntity.ok("Reindex completed.");
    }
}