// src/main/java/com.sistemacontable.../Service/ArticleServiceImp.java
package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Supplier;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ArticleRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.SupplierRepository;
import com.sistemacontable.sistema_contable.dto.ArticleRequestDTO;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArticleServiceImp implements ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    // ===================================================
    // C - CREAR (createArticle)
    // ===================================================
    @Override
    @Transactional
    public Article createArticle(ArticleRequestDTO dto) {

        // 1. Validación de Unicidad (Código)
        if (articleRepository.findByCodigo(dto.getCodigo()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un Artículo con ese código: " + dto.getCodigo());
        }

        // 2. Buscar y Validar Proveedor (Relación @ManyToOne)
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new EntityNotFoundException("Proveedor con ID " + dto.getSupplierId() + " no encontrado."));

        // 3. Crear Entidad
        Article newArticle = new Article();
        newArticle.setNombre(dto.getNombre());
        newArticle.setDescripcion(dto.getDescripcion());
        newArticle.setCodigo(dto.getCodigo());
        if (dto.getStockActual() == null) {
            newArticle.setStockActual(0);
        } else {
            newArticle.setStockActual(dto.getStockActual());
        }
        newArticle.setStockMinimo(dto.getStockMinimo());
        newArticle.setPrecioUnitario(dto.getPrecioUnitario());
        newArticle.setPresentacion(dto.getPresentacion());
        newArticle.setSupplier(supplier);

        return articleRepository.save(newArticle);
    }

    // ===================================================
    // R - LEER / DETALLE (getArticleDetail)
    // ===================================================
    @Override
    @Transactional(readOnly = true)
    public Article getArticleDetail(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artículo no encontrado."));
    }

    // ===================================================
    // R - LEER / LISTADO (getAllArticles)
    // ===================================================
    @Override
    @Transactional(readOnly = true)
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    // ===================================================
    // U - ACTUALIZAR (editArticle)
    // ===================================================
    @Override
    @Transactional
    public Article editArticle(Long id, ArticleRequestDTO dto) {

        // 1. Buscar Artículo
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artículo con ID " + id + " no encontrado."));

        // 2. Validación de Unicidad (Código)
        // Se asegura que si el código cambia, no colisione con otro artículo
        if (!article.getCodigo().equals(dto.getCodigo())) {
            if (articleRepository.findByCodigo(dto.getCodigo()).isPresent()) {
                throw new IllegalArgumentException("El nuevo código ya pertenece a otro Artículo.");
            }
        }

        // 3. Buscar y Validar Proveedor (si el ID cambia)
        Supplier supplier = article.getSupplier();
        if (!supplier.getId().equals(dto.getSupplierId())) {
            supplier = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new EntityNotFoundException("Proveedor con ID " + dto.getSupplierId() + " no encontrado."));
        }

        // 4. Actualizar campos
        article.setNombre(dto.getNombre());
        article.setDescripcion(dto.getDescripcion());
        article.setCodigo(dto.getCodigo());
        article.setStockMinimo(dto.getStockMinimo());
        article.setPrecioUnitario(dto.getPrecioUnitario());
        article.setPresentacion(dto.getPresentacion());
        article.setSupplier(supplier);

        return articleRepository.save(article);
    }

    // ===================================================
    // D - ELIMINAR LÓGICO (deleteArticle - Asumimos stock a 0)
    // ===================================================
    @Override
    @Transactional
    public void deleteArticle(Long id) {

        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artículo con ID " + id + " no encontrado."));

        // La eliminación de un producto suele ser una desactivación o ajuste de stock.
        // Aquí lo pondremos en Stock 0, asumiendo que el borrado físico está restringido.
        article.setStockActual(0);
        // Si la Entidad Article tuviera un campo 'active' (como Supplier), lo usaríamos:
        // article.setActive(false); 

        articleRepository.save(article);
    }

    // ===================================================
    // BÚSQUEDA ADICIONAL (searchArticles)
    // ===================================================
    @Override
    @Transactional(readOnly = true)
    public List<Article> searchArticles(String term) {
        // Se necesitaría un método en ArticleRepository como:
        // List<Article> findByNombreContainingIgnoreCaseOrCodigoEquals(String nombre, Integer codigo);
        // Por simplicidad, asumimos que solo buscamos por nombre
        return articleRepository.findByNombreContainingIgnoreCase(term);
    }
}
