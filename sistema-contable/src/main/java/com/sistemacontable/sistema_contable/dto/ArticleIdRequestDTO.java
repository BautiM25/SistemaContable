// src/main/java/com.sistemacontable/sistema_contable/dto/ArticleIdRequestDTO.java
package com.sistemacontable.sistema_contable.dto;

import jakarta.validation.constraints.NotNull;

public class ArticleIdRequestDTO {

    @NotNull(message = "El ID del Artículo es Obligatorio")
    private Long articleId;

    // --- Constructor por defecto ---
    public ArticleIdRequestDTO() {
    }

    // --- Getters y Setters ---
    public Long getArticleId() {
        return articleId;
    }

    public void setArticleId(Long articleId) {
        this.articleId = articleId;
    }
}
