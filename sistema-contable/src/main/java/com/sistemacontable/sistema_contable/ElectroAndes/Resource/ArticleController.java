package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemacontable.sistema_contable.ElectroAndes.Service.ArticleService;
import com.sistemacontable.sistema_contable.dto.ArticleStockWarningDto;
import com.sistemacontable.sistema_contable.dto.CreateArticleDto;
import com.sistemacontable.sistema_contable.dto.ResponseArticleDto;

@RestController
@RequestMapping("/api/articulos")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    // 1. OBTENER TODOS
    @GetMapping
    public List<ResponseArticleDto> getAll() {
        // El servicio ahora se encarga de transformar la lista de entidades a DTOs
        return articleService.findAll();
    }

    // 2. OBTENER POR ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseArticleDto> getById(@PathVariable Long id) {
        return articleService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. OBTENER POR REFERENCIA
    @GetMapping("/referencia/{ref}")
    public ResponseEntity<ResponseArticleDto> getByReferencia(@PathVariable String ref) {
        ResponseArticleDto dto = articleService.findByReferencia(ref);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }

    // 4. CREAR NUEVO ARTICULO
    @PostMapping
    public ResponseEntity<ResponseArticleDto> create(@RequestBody CreateArticleDto createArticleDto) {
        try {
            ResponseArticleDto savedDto = articleService.save(createArticleDto);
            return new ResponseEntity<>(savedDto, HttpStatus.CREATED);
        } catch (Exception e) {
            // Podrías loguear el error aquí para debuguear
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // 5. ACTUALIZAR EXISTENTE
    @PutMapping("/{id}")
    public ResponseEntity<ResponseArticleDto> update(@PathVariable Long id, @RequestBody CreateArticleDto updateDto) {
        try {
            ResponseArticleDto updatedDto = articleService.update(id, updateDto);
            return ResponseEntity.ok(updatedDto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 6. ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (articleService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // 7. OBTENER ARTÍCULOS CON BAJO STOCK
    @GetMapping("/alertas-stock")
    public List<ArticleStockWarningDto> getBajoStock() {
        return articleService.getBajoStock();
    }

    @PutMapping("/disable/{id}")
    public ResponseEntity<Void> disable(@PathVariable Long id) {
        if (articleService.disable(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
