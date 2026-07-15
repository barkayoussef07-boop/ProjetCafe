package com.cafe.cafeapi.service;

import com.cafe.cafeapi.dto.category.CategoryRequest;
import com.cafe.cafeapi.dto.category.CategoryResponse;
import com.cafe.cafeapi.exception.ResourceNotFoundException;
import com.cafe.cafeapi.model.Category;
import com.cafe.cafeapi.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        Category category = Category.builder()
                .nom(request.getNom())
                .ordreAffichage(request.getOrdreAffichage())
                .build();
        return toResponse(categoryRepository.save(category));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = getEntity(id);
        category.setNom(request.getNom());
        category.setOrdreAffichage(request.getOrdreAffichage());
        return toResponse(categoryRepository.save(category));
    }

    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categorie introuvable : " + id);
        }
        categoryRepository.deleteById(id);
    }

    private Category getEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categorie introuvable : " + id));
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .nom(category.getNom())
                .ordreAffichage(category.getOrdreAffichage())
                .build();
    }
}
