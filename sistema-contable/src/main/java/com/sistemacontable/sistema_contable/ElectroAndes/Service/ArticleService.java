package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.util.List;
import java.util.Optional;

import com.sistemacontable.sistema_contable.dto.ArticleStockWarningDto;
import com.sistemacontable.sistema_contable.dto.CreateArticleDto;
import com.sistemacontable.sistema_contable.dto.ResponseArticleDto;

public interface ArticleService {

    List<ResponseArticleDto> findAll();

    Optional<ResponseArticleDto> findById(Long id);

    ResponseArticleDto findByReferencia(String referencia);

    ResponseArticleDto save(CreateArticleDto dto);

    ResponseArticleDto update(Long id, CreateArticleDto dto);

    boolean delete(Long id);

    List<ArticleStockWarningDto> getBajoStock();
}
