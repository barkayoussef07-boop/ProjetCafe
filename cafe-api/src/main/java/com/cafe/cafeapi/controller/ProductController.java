package com.cafe.cafeapi.controller;

import com.cafe.cafeapi.dto.product.ProductAvailabilityRequest;
import com.cafe.cafeapi.dto.product.ProductRequest;
import com.cafe.cafeapi.dto.product.ProductResponse;
import com.cafe.cafeapi.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products?categorieId=1 - public (consultation du menu sans compte)
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll(@RequestParam(required = false) Long categorieId) {
        return ResponseEntity.ok(productService.findAll(categorieId));
    }

    // GET /api/products/{id} - public
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    // POST /api/products - GERANT uniquement
    @PostMapping
    @PreAuthorize("hasRole('GERANT')")
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.create(request));
    }

    // PUT /api/products/{id} - GERANT uniquement
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GERANT')")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    // PATCH /api/products/{id}/disponibilite - COMPTOIRISTE ou GERANT (gestion du stock)
    @PatchMapping("/{id}/disponibilite")
    @PreAuthorize("hasAnyRole('COMPTOIRISTE', 'GERANT')")
    public ResponseEntity<ProductResponse> updateAvailability(
            @PathVariable Long id,
            @Valid @RequestBody ProductAvailabilityRequest request
    ) {
        return ResponseEntity.ok(productService.updateAvailability(id, request.getDisponible()));
    }

    // DELETE /api/products/{id} - GERANT uniquement
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GERANT')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
