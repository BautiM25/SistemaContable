package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleSolicitud;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ArticleRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.SolicitudCompraRepository;
import com.sistemacontable.sistema_contable.dto.CreateDetalleSolicitudDto;
import com.sistemacontable.sistema_contable.dto.CreateSolicitudCompraDto;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class SolicitudCompraServiceImp implements SolicitudCompraService {

    @Autowired
    private SolicitudCompraRepository solicitudRepo;
    @Autowired
    private ArticleRepository articleRepo;

    @Override
    @Transactional
    public SolicitudCompra crear(CreateSolicitudCompraDto dto) {
        SolicitudCompra solicitud = new SolicitudCompra();
        solicitud.setNumeroSolicitud(dto.getNumeroSolicitud());
        solicitud.setEstado(true); // Activa por defecto

        for (CreateDetalleSolicitudDto dDto : dto.getDetalles()) {
            Article art = articleRepo.findById(dDto.getIdArticulo())
                    .orElseThrow(() -> new RuntimeException("Artículo no encontrado"));

            DetalleSolicitud detalle = new DetalleSolicitud();
            detalle.setArticulo(art);
            detalle.setDescripcion(dDto.getDescripcion());
            detalle.setCantidad(dDto.getCantidad());
            detalle.setMedida(dDto.getMedida());
            detalle.setEspecificacionesTecnicas(dDto.getEspecificacionesTecnicas());
            detalle.setFechaLimite(dDto.getFechaLimite());
            detalle.setEstado(true);

            solicitud.addDetalle(detalle);
        }
        return solicitudRepo.save(solicitud);
    }

    @Override
    public List<SolicitudCompra> obtenerActivas() {
        return solicitudRepo.findByEstadoTrue();
    }

    // 📌 NUEVO: Obtener todas las solicitudes (activas e inactivas)
    @Override
    public List<SolicitudCompra> obtenerTodas() {
        return solicitudRepo.findAll();
    }

    @Override
    public SolicitudCompra obtenerPorId(Long id) {
        return solicitudRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("No existe"));
    }

    @Override
    public SolicitudCompra obtenerPorNumero(String numeroSolicitud) {
        return solicitudRepo.findByNumeroSolicitud(numeroSolicitud)
                .orElseThrow(() -> new EntityNotFoundException("Solicitud con número " + numeroSolicitud + " no encontrada"));
    }

    @Override
    public void cambiarEstado(Long id, boolean estado) {
        SolicitudCompra s = obtenerPorId(id);
        s.setEstado(estado);
        solicitudRepo.save(s);
    }
}