package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleSolicitud;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Proveedor;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ArticleRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ProveedorRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.SolicitudCompraRepository;
import com.sistemacontable.sistema_contable.dto.ArticuloVinculadoDto;
import com.sistemacontable.sistema_contable.dto.CreateDetalleSolicitudDto;
import com.sistemacontable.sistema_contable.dto.CreateSolicitudCompraDto;
import com.sistemacontable.sistema_contable.dto.ResponseProveedorDto;

import jakarta.persistence.EntityNotFoundException;

@Service
public class SolicitudCompraServiceImp implements SolicitudCompraService {

    @Autowired
    private SolicitudCompraRepository solicitudRepo;
    @Autowired
    private ArticleRepository articleRepo;
    @Autowired
    private ProveedorRepository proveedorRepo;

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

    @Override
    @Transactional(readOnly = true) // 3. AHORA SÍ RECONOCE EL readOnly
    public List<ResponseProveedorDto> buscarProveedoresAptos(Long idSolicitud) {
        SolicitudCompra solicitud = solicitudRepo.findById(idSolicitud)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        List<Long> idsArticulos = solicitud.getDetalles().stream()
                .filter(d -> d.getEstado() && d.getArticulo() != null)
                .map(d -> d.getArticulo().getId())
                .distinct()
                .collect(Collectors.toList());

        if (idsArticulos.isEmpty()) {
            return new ArrayList<>();
        }

        List<Proveedor> proveedores = proveedorRepo.findProveedoresAptos(
                idsArticulos,
                (long) idsArticulos.size()
        );

        return proveedores.stream()
                .map(this::convertToResponseDto) // 4. REFERENCIA AL MÉTODO DE ABAJO
                .collect(Collectors.toList());
    }

    // 5. AGREGAMOS EL MÉTODO DE MAPEÓ QUE FALTABA
    private ResponseProveedorDto convertToResponseDto(Proveedor entity) {
        ResponseProveedorDto dto = new ResponseProveedorDto();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCuitCuil(entity.getCuitCuil());
        dto.setMail(entity.getMail());
        dto.setRubro(entity.getRubro());
        dto.setCategoriaIva(entity.getCategoriaIva());
        dto.setDivisa(entity.getDivisa());
        dto.setSaldoInicialCC(entity.getSaldoInicialCC());
        dto.setBanco(entity.getBanco());

        // Mapeamos los artículos que suministra este proveedor
        if (entity.getArticulosSuministrados() != null) {
            dto.setArticulos(entity.getArticulosSuministrados().stream()
                    .map(ap -> {
                        ArticuloVinculadoDto aDto = new ArticuloVinculadoDto();
                        aDto.setIdArticulo(ap.getArticulo().getId());
                        aDto.setReferencia(ap.getArticulo().getReferencia());
                        aDto.setDescripcion(ap.getArticulo().getDescripcion());
                        aDto.setPrecioPactado(ap.getPrecio());
                        return aDto;
                    }).collect(Collectors.toList()));
        }
        return dto;
    }
}
