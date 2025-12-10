// src/main/java/com/sistemacontable/sistema_contable/ElectroAndes/Service/SolicitudCompraServiceImp.java
package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleSolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Usuario;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ArticleRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.SolicitudCompraRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.UsuarioRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.SolicitudCompraMapper;
import com.sistemacontable.sistema_contable.dto.CreateSolicitudCompraDto;
import com.sistemacontable.sistema_contable.dto.CreateDetalleSolicitudDto;
import com.sistemacontable.sistema_contable.dto.ResponseSolicitudCompraDto;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitudCompraServiceImp implements SolicitudCompraService {

    private final SolicitudCompraRepository solicitudCompraRepository;
    private final UsuarioRepository usuarioRepository; // Para buscar el solicitante
    private final ArticleRepository articleRepository; // Para buscar los artículos
    private final SolicitudCompraMapper solicitudCompraMapper;

    @Autowired
    public SolicitudCompraServiceImp(
            SolicitudCompraRepository solicitudCompraRepository,
            UsuarioRepository usuarioRepository,
            ArticleRepository articleRepository,
            SolicitudCompraMapper solicitudCompraMapper) {
        this.solicitudCompraRepository = solicitudCompraRepository;
        this.usuarioRepository = usuarioRepository;
        this.articleRepository = articleRepository;
        this.solicitudCompraMapper = solicitudCompraMapper;
    }

    // ===================================================
    // C - CREAR SOLICITUD
    // ===================================================
    @Override
    @Transactional
    public ResponseSolicitudCompraDto createSolicitud(CreateSolicitudCompraDto dto) {
        
        // 1. Validar unicidad del número de solicitud
        if (solicitudCompraRepository.findByNumeroSolicitud(dto.getNumeroSolicitud()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una Solicitud de Compra con el número: " + dto.getNumeroSolicitud());
        }

        // 2. Buscar y validar Usuario solicitante
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuarioSolicitante())
                .orElseThrow(() -> new EntityNotFoundException("Usuario solicitante no encontrado."));

        SolicitudCompra nuevaSolicitud = new SolicitudCompra();
        nuevaSolicitud.setNumeroSolicitud(dto.getNumeroSolicitud());
        nuevaSolicitud.setUsuarioSolicitante(usuario);
        nuevaSolicitud.setJustificacionGeneral(dto.getJustificacionGeneral());
        nuevaSolicitud.setFechaSolicitud(LocalDate.now());
        nuevaSolicitud.setFechaCreacion(LocalDate.now());
        nuevaSolicitud.setEstado("PENDIENTE"); // Estado inicial

        List<DetalleSolicitudCompra> detalles = new ArrayList<>();
        
        // 3. Procesar y validar los detalles
        for (CreateDetalleSolicitudDto detalleDto : dto.getDetalles()) {
            Article article = articleRepository.findById(detalleDto.getIdArticulo())
                    .orElseThrow(() -> new EntityNotFoundException("Artículo con ID " + detalleDto.getIdArticulo() + " no encontrado."));

            DetalleSolicitudCompra detalle = new DetalleSolicitudCompra();
            detalle.setArticulo(article);
            detalle.setCantidadRequerida(detalleDto.getCantidadRequerida());
            detalle.setMotivoCompra(detalleDto.getMotivoCompra());
            detalle.setSolicitudCompra(nuevaSolicitud); // Establecer la relación bidireccional
            
            detalles.add(detalle);
        }

        nuevaSolicitud.setDetalles(detalles);
        
        // 4. Guardar y mapear
        SolicitudCompra savedSolicitud = solicitudCompraRepository.save(nuevaSolicitud);
        return solicitudCompraMapper.mapToDto(savedSolicitud);
    }

    // ===================================================
    // R - LISTAR TODOS
    // ===================================================
    @Override
    @Transactional(readOnly = true)
    public List<ResponseSolicitudCompraDto> getAllSolicitudes() {
        return solicitudCompraRepository.findAll().stream()
                .map(solicitudCompraMapper::mapToDto)
                .collect(Collectors.toList());
    }

    // ===================================================
    // R - OBTENER POR ID
    // ===================================================
    @Override
    @Transactional(readOnly = true)
    public ResponseSolicitudCompraDto getSolicitudById(Long id) {
        SolicitudCompra solicitud = findSolicitudEntityById(id);
        return solicitudCompraMapper.mapToDto(solicitud);
    }
    
    // ===================================================
    // U - CAMBIAR ESTADO
    // ===================================================
    @Override
    @Transactional
    public ResponseSolicitudCompraDto changeSolicitudStatus(Long id, String newStatus) {
        SolicitudCompra solicitud = findSolicitudEntityById(id);
        
        // Lógica de validación de transición de estado (opcional, pero recomendado)
        String upperStatus = newStatus.toUpperCase();
        if (upperStatus.equals("APROBADA") || upperStatus.equals("RECHAZADA")) {
            solicitud.setEstado(upperStatus);
        } else {
            throw new IllegalArgumentException("Estado inválido para la Solicitud: " + newStatus);
        }
        
        SolicitudCompra updatedSolicitud = solicitudCompraRepository.save(solicitud);
        return solicitudCompraMapper.mapToDto(updatedSolicitud);
    }

    // Método auxiliar para buscar entidad y manejar 404
    @Override
    @Transactional(readOnly = true)
    public SolicitudCompra findSolicitudEntityById(Long id) {
        return solicitudCompraRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitud de Compra con ID " + id + " no encontrada."));
    }
}