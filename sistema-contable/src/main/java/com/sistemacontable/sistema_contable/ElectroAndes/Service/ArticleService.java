// src/main/java/com.sistemacontable.../Service/ArticleService.java
package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.util.List;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.dto.ArticleRequestDTO;

public interface ArticleService {

    // Crear
    Article createArticle(ArticleRequestDTO dto);

    // Leer (Listar todos, sin paginación por simplicidad)
    List<Article> getAllArticles();

    // Leer (Obtener por ID)
    Article getArticleDetail(Long id);

    // Actualizar
    Article editArticle(Long id, ArticleRequestDTO dto);

    // Eliminar (Lógico, por stock)
    void deleteArticle(Long id);

    // Buscar (por nombre o código, ejemplo adicional)
    List<Article> searchArticles(String term);
}
