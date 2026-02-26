package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Proveedor;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ArticleRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ProveedorRepository;
import com.sistemacontable.sistema_contable.dto.ArticleStockWarningDto;
import com.sistemacontable.sistema_contable.dto.CreateArticleDto;
import com.sistemacontable.sistema_contable.dto.ResponseArticleDto;

@Service
public class ArticleServiceImp implements ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ResponseArticleDto> findAll() {
        return articleRepository.findAll().stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ResponseArticleDto> findById(Long id) {
        return articleRepository.findById(id).map(this::convertToResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ResponseArticleDto findByReferencia(String referencia) {
        Article article = articleRepository.findByReferencia(referencia);
        return (article != null) ? convertToResponseDto(article) : null;
    }

    @Override
    @Transactional
    public ResponseArticleDto save(CreateArticleDto dto) {
        Article article = new Article();
        mapDtoToEntity(dto, article);
        // Inicializamos stocks en 0 para nuevos artículos
        article.setStockFisico(dto.getStockFisico() != null ? dto.getStockFisico() : 0);
        article.setStockPendienteRecibir(0);

        Article saved = articleRepository.save(article);
        return convertToResponseDto(saved);
    }

    @Override
    @Transactional
    public ResponseArticleDto update(Long id, CreateArticleDto dto) {
        return articleRepository.findById(id).map(article -> {
            mapDtoToEntity(dto, article);
            return convertToResponseDto(articleRepository.save(article));
        }).orElseThrow(() -> new RuntimeException("Artículo no encontrado con id: " + id));
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return articleRepository.findById(id).map(article -> {
            articleRepository.delete(article);
            return true;
        }).orElse(false);
    }

    @Override
    @Transactional
    public boolean disable(Long id) {
        return articleRepository.findById(id).map(article -> {
            article.setHabilitado(false);
            articleRepository.save(article);
            return true;
        }).orElse(false);
    }

    @Override
    @Transactional
    public boolean enable(Long id) {
        return articleRepository.findById(id).map(article -> {
            article.setHabilitado(true);
            articleRepository.save(article);
            return true;
        }).orElse(false);
    }

    // --- MÉTODOS AUXILIARES DE MAPEO ---
    private void mapDtoToEntity(CreateArticleDto dto, Article entity) {
        entity.setReferencia(dto.getReferencia());
        entity.setDescripcion(dto.getDescripcion());
        entity.setFamilia(dto.getFamilia());
        entity.setHabilitado(dto.isHabilitado());
        entity.setEnvaseSiNo(dto.isEnvaseSiNo());
        entity.setUnidadesPorEnvase(dto.getUnidadesPorEnvase());
        entity.setModalidadIvaCompra(dto.getModalidadIvaCompra());
        entity.setCostoDivisa(dto.getCostoDivisa());
        entity.setCostoBase(dto.getCostoBase());
        entity.setDivisa(dto.getDivisa());
        entity.setModalidadIvaVenta(dto.getModalidadIvaVenta());
        entity.setPrecioPublico(dto.getPrecioPublico());
        entity.setPrecioMayorista(dto.getPrecioMayorista());
        entity.setDescuentoMaximo(dto.getDescuentoMaximo());
        entity.setListaPrecios(dto.getListaPrecios());
        entity.setStockMinimo(dto.getStockMinimo());
        entity.setStockMaximo(dto.getStockMaximo());
        entity.setComentarios(dto.getComentarios());

        // Buscamos y asignamos el proveedor si se envió un ID
        if (dto.getIdProveedorHabitual() != null) {
            Proveedor proveedor = proveedorRepository.findById(dto.getIdProveedorHabitual())
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
            entity.setProveedorHabitual(proveedor);
        }
    }

    private ResponseArticleDto convertToResponseDto(Article entity) {
        ResponseArticleDto dto = new ResponseArticleDto();
        dto.setId(entity.getId());
        dto.setReferencia(entity.getReferencia());
        dto.setDescripcion(entity.getDescripcion());
        dto.setFamilia(entity.getFamilia());
        dto.setHabilitado(entity.isHabilitado());
        dto.setPrecioPublico(entity.getPrecioPublico());
        dto.setStockFisico(entity.getStockFisico());
        dto.setStockMinimo(entity.getStockMinimo());
        dto.setComentarios(entity.getComentarios());

        if (entity.getProveedorHabitual() != null) {
            dto.setIdProveedorHabitual(entity.getProveedorHabitual().getId());
            dto.setNombreProveedorHabitual(entity.getProveedorHabitual().getNombre());
        }
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ArticleStockWarningDto> getBajoStock() {
        return articleRepository.findArticlesLowStock().stream()
                .map(this::convertToStockWarningDto)
                .collect(Collectors.toList());
    }

    private ArticleStockWarningDto convertToStockWarningDto(Article entity) {
        ArticleStockWarningDto dto = new ArticleStockWarningDto();
        dto.setId(entity.getId());
        dto.setReferencia(entity.getReferencia());
        dto.setDescripcion(entity.getDescripcion());
        dto.setStockFisico(entity.getStockFisico());
        dto.setStockMinimo(entity.getStockMinimo());

        // Lógica pedida: true si es igual, false si es menor (debajo)
        dto.setEsIgualAlMinimo(entity.getStockFisico().equals(entity.getStockMinimo()));

        return dto;
    }

    @Override
    @Transactional
    public List<ResponseArticleDto> findByStatus(boolean activo) {
        if (activo) {
            return articleRepository.findByHabilitadoTrue().stream()
                    .map(this::convertToResponseDto)
                    .collect(Collectors.toList());
        } else {
            return articleRepository.findByHabilitadoFalse().stream()
                    .map(this::convertToResponseDto)
                    .collect(Collectors.toList());
        }
    }
}
