// src/main/java/com.sistemacontable.../Resource/ArticleController.java
package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.ArticleService; // Usamos la interfaz
import com.sistemacontable.sistema_contable.ElectroAndes.Util.ArticleMapper;
import com.sistemacontable.sistema_contable.dto.ArticleRequestDTO;
import com.sistemacontable.sistema_contable.dto.ArticleResponseDTO;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/articles") // Nueva ruta base para el CRUD de artículos
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private ArticleMapper articleMapper;

    // ===================================================
    // C - CREAR ARTÍCULO (POST)
    // ===================================================
    @PostMapping("/create")
    public ResponseEntity<?> createArticle(@Valid @RequestBody ArticleRequestDTO request) {
        try {
            // Llama al servicio, que maneja la lógica de unicidad del código y búsqueda del proveedor
            Article newArticle = articleService.createArticle(request);

            // Devuelve el artículo creado mapeado a DTO
            ArticleResponseDTO response = articleMapper.mapToDto(newArticle);

            return ResponseEntity.status(HttpStatus.CREATED).body(response); // 201 Created
        } catch (EntityNotFoundException e) {
            // Captura si el supplierId no existe
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error al crear: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            // Captura si el código ya existe
            return ResponseEntity.badRequest().body("Error al crear: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());
        }
    }

    // ===================================================
    // R - LISTAR TODOS (GET)
    // ===================================================
    @GetMapping
    public ResponseEntity<List<ArticleResponseDTO>> getAllArticles() {

        List<Article> articles = articleService.getAllArticles();

        // Mapea la lista de Entidades a una lista de DTOs
        List<ArticleResponseDTO> dtos = articleMapper.toDtoList(articles);

        return ResponseEntity.ok(dtos); // 200 OK
    }

    // ===================================================
    // R - OBTENER DETALLE (GET /articles/{id})
    // ===================================================
    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleDetail(@PathVariable Long id) {
        try {
            Article article = articleService.getArticleDetail(id);
            ArticleResponseDTO dto = articleMapper.mapToDto(article);

            return ResponseEntity.ok(dto); // 200 OK
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Artículo no encontrado."); // 404 Not Found
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al obtener el artículo.");
        }
    }

    // ===================================================
    // U - EDITAR ARTÍCULO (PUT /articles/{id})
    // ===================================================
    // Usamos PUT/PATCH, que es la convención REST para actualizar un recurso
    @PutMapping("/{id}")
    public ResponseEntity<?> editArticle(@PathVariable Long id, @Valid @RequestBody ArticleRequestDTO request) {
        try {
            Article updatedArticle = articleService.editArticle(id, request);
            ArticleResponseDTO response = articleMapper.mapToDto(updatedArticle);

            return ResponseEntity.ok(response); // 200 OK
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error al editar: " + e.getMessage()); // 404
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error al editar: " + e.getMessage()); // 400
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al editar el artículo.");
        }
    }

    // ===================================================
    // D - ELIMINAR/DESACTIVAR LÓGICO (DELETE /articles/{id})
    // ===================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable Long id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.ok("Artículo eliminado correctamente (Stock en 0)."); // 200 OK
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Artículo no encontrado."); // 404
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al eliminar el artículo.");
        }
    }
}
