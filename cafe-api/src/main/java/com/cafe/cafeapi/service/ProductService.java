package com.cafe.cafeapi.service;

import com.cafe.cafeapi.dto.category.CategoryResponse;
import com.cafe.cafeapi.dto.product.ProductRequest;
import com.cafe.cafeapi.dto.product.ProductResponse;
import com.cafe.cafeapi.exception.ResourceNotFoundException;
import com.cafe.cafeapi.model.Category;
import com.cafe.cafeapi.model.Product;
import com.cafe.cafeapi.repository.CategoryRepository;
import com.cafe.cafeapi.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public List<ProductResponse> findAll(Long categorieId) {
        List<Product> products = (categorieId != null)
                ? productRepository.findByCategorieId(categorieId)
                : productRepository.findAll();

        return products.stream().map(this::toResponse).toList();
    }

    public ProductResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    public ProductResponse create(ProductRequest request) {
        Category category = getCategoryEntity(request.getCategorieId());

        Product product = Product.builder()
                .nom(request.getNom())
                .description(request.getDescription())
                .prix(request.getPrix())
                .image(request.getImage())
                .disponible(request.getDisponible() != null ? request.getDisponible() : true)
                .categorie(category)
                .build();

        return toResponse(productRepository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getEntity(id);
        Category category = getCategoryEntity(request.getCategorieId());

        product.setNom(request.getNom());
        product.setDescription(request.getDescription());
        product.setPrix(request.getPrix());
        product.setImage(request.getImage());
        if (request.getDisponible() != null) {
            product.setDisponible(request.getDisponible());
        }
        product.setCategorie(category);

        return toResponse(productRepository.save(product));
    }

    public ProductResponse updateAvailability(Long id, boolean disponible) {
        Product product = getEntity(id);
        product.setDisponible(disponible);
        return toResponse(productRepository.save(product));
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produit introuvable : " + id);
        }
        productRepository.deleteById(id);
    }

    private Product getEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable : " + id));
    }

    private Category getCategoryEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categorie introuvable : " + id));
    }

    private ProductResponse toResponse(Product product) {
        Category c = product.getCategorie();
        return ProductResponse.builder()
                .id(product.getId())
                .nom(product.getNom())
                .description(product.getDescription())
                .prix(product.getPrix())
                .image(product.getImage())
                .disponible(product.getDisponible())
                .categorie(CategoryResponse.builder()
                        .id(c.getId())
                        .nom(c.getNom())
                        .ordreAffichage(c.getOrdreAffichage())
                        .build())
                .build();
    }
}
