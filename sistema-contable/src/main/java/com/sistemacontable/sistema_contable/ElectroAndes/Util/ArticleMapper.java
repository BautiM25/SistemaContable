// src/main/java/com.sistemacontable/sistema_contable/ElectroAndes/Util/ArticleMapper.java
package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Supplier;
import com.sistemacontable.sistema_contable.dto.ArticleResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ArticleMapper {

    // Mapea una sola Entidad a su DTO de Respuesta
    public ArticleResponseDTO mapToDto(Article article) {
        if (article == null) {
            return null;
        }

        ArticleResponseDTO dto = new ArticleResponseDTO();

        // Mapeo de campos directos
        dto.setId(article.getId());
        dto.setNombre(article.getNombre());
        dto.setDescripcion(article.getDescripcion());
        dto.setCodigo(article.getCodigo());
        dto.setStockActual(article.getStockActual());
        dto.setStockMinimo(article.getStockMinimo());
        dto.setPrecioUnitario(article.getPrecioUnitario());
        dto.setPresentacion(article.getPresentacion());

        // Mapeo seguro para timestamps
        dto.setCreatedAt(article.getCreatedAt() != null ? article.getCreatedAt() : null);

        // Mapeo de la Relación (Proveedor)
        // La Entidad Article debe tener el Supplier cargado aquí (no LAZY)
        Supplier supplier = article.getSupplier();
        if (supplier != null) {
            dto.setSupplierId(supplier.getId());
            dto.setSupplierName(supplier.getName());
        }

        return dto;
    }

    // Mapea una lista de Entidades a una lista de DTOs
    public List<ArticleResponseDTO> toDtoList(List<Article> articles) {
        return articles.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
}
