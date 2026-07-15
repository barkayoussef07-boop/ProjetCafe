package com.cafe.cafeapi.controller;

import com.cafe.cafeapi.dto.category.CategoryRequest;
import com.cafe.cafeapi.dto.category.CategoryResponse;
import com.cafe.cafeapi.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // GET /api/categories - public (consultation du menu sans compte)
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    // POST /api/categories - GERANT uniquement
    @PostMapping
    @PreAuthorize("hasRole('GERANT')")
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.create(request));
    }

    // PUT /api/categories/{id} - GERANT uniquement
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GERANT')")
    public ResponseEntity<CategoryResponse> update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.update(id, request));
    }

    // DELETE /api/categories/{id} - GERANT uniquement
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GERANT')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
