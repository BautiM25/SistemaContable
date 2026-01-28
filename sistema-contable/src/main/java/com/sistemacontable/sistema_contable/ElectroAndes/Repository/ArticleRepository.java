package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    // Spring Data JPA crea la consulta automáticamente basándose en el nombre del método
    Article findByReferencia(String referencia);

    // Opcional: Podrías agregar uno para buscar por familia si lo necesitas luego
    // List<Article> findByFamilia(String familia);
    // Buscamos artículos donde el stock físico sea menor o igual al mínimo
    @Query("SELECT a FROM Article a WHERE a.stockFisico <= a.stockMinimo")
    List<Article> findArticlesLowStock();
}
