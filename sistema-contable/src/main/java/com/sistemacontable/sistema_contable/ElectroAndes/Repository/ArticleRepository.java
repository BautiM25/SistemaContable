// src/main/java/com.sistemacontable.../Repository/ArticleRepository.java
package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Supplier;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    // Necesario para verificar unicidad del código (similar a email/phone en Supplier)
    Optional<Article> findByCodigo(Integer codigo);

    // Puedes necesitar un método para buscar artículos por proveedor si no lo haces por Service
    List<Article> findBySupplier(Supplier supplier);
}
