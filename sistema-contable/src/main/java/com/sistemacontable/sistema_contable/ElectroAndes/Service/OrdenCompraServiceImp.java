package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleOrdenCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleSolicitud;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.OrdenCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Proveedor;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.OrdenCompraRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ProveedorRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.SolicitudCompraRepository;
import com.sistemacontable.sistema_contable.dto.CreateDetalleOrdenCompraDto;
import com.sistemacontable.sistema_contable.dto.CreateOrdenCompraDto;
import jakarta.transaction.Transactional;
import jakarta.persistence.EntityNotFoundException;

@Service
public class OrdenCompraServiceImp implements OrdenCompraService {

    @Autowired
    private OrdenCompraRepository ordenRepo;
    @Autowired
    private SolicitudCompraRepository solicitudRepo;
    @Autowired
    private ProveedorRepository proveedorRepo;

    // OrdenCompraServiceImp.java
    @Override
    @Transactional
    public OrdenCompra generarDesdeSolicitud(CreateOrdenCompraDto dto) {
        // 1. Cargar Entidades Base
        SolicitudCompra solicitud = solicitudRepo.findById(dto.getIdSolicitud())
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        Proveedor proveedor = proveedorRepo.findById(dto.getIdProveedor())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        // 2. Preparar Cabecera de la Orden
        OrdenCompra orden = new OrdenCompra();
        orden.setNumeroOrdenCompra(dto.getNumeroOrdenCompra());
        orden.setFechaEmision(LocalDate.now());
        orden.setSolicitudAsociada(solicitud);
        orden.setProveedor(proveedor);
        orden.setCondicionesPago(dto.getCondicionesPago());
        orden.setComprador(dto.getComprador());
        orden.setObservaciones(dto.getObservaciones());

        BigDecimal acumuladoSubtotal = BigDecimal.ZERO;

        // 3. Procesar items enviados desde el Frontend
        for (CreateDetalleOrdenCompraDto itemDto : dto.getDetalles()) {

            // Buscamos el detalle correspondiente en la SOLICITUD
            DetalleSolicitud dSol = solicitud.getDetalles().stream()
                    .filter(ds -> ds.getArticulo().getId().equals(itemDto.getIdArticulo()) && ds.getEstado())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("El artículo " + itemDto.getIdArticulo() + " no está pendiente en esta solicitud"));

            // --- REGLA DE NEGOCIO: Actualizar Solicitud ---
            if (itemDto.getCantidad() >= dSol.getCantidad()) {
                // Caso: Se pidió todo o más de lo que había. Se cierra el item.
                dSol.setCantidad(0.0); // O podrías dejarlo en lo que estaba, pero el estado va a false
                dSol.setEstado(false);
            } else {
                // Caso: Orden parcial. Restamos lo pedido y sigue activo.
                dSol.setCantidad(dSol.getCantidad() - itemDto.getCantidad());
            }

            // --- Crear Detalle de la Orden ---
            DetalleOrdenCompra dOrd = new DetalleOrdenCompra();
            dOrd.setOrdenCompra(orden);
            dOrd.setArticulo(dSol.getArticulo());
            dOrd.setCantidad(itemDto.getCantidad());
            dOrd.setPrecioUnitario(itemDto.getPrecioUnitario());
            dOrd.setMedida(itemDto.getMedida());

            orden.getDetalles().add(dOrd);

            // Cálculo financiero
            BigDecimal linea = itemDto.getPrecioUnitario().multiply(BigDecimal.valueOf(itemDto.getCantidad()));
            acumuladoSubtotal = acumuladoSubtotal.add(linea);
        }

        // 4. Totales de la Orden
        orden.setSubtotal(acumuladoSubtotal);
        orden.setIva(acumuladoSubtotal.multiply(new BigDecimal("0.21")));
        orden.setTotal(orden.getSubtotal().add(orden.getIva()));
        orden.setMoneda(orden.getDetalles().get(0).getArticulo().getDivisa());

        // 5. Actualizar Cabecera de Solicitud
        solicitud.setFechaEmisionOC(LocalDate.now());

        // Opcional: Si todos los items de la solicitud están en false, cerramos la solicitud completa
        boolean tieneItemsPendientes = solicitud.getDetalles().stream().anyMatch(DetalleSolicitud::getEstado);
        if (!tieneItemsPendientes) {
            solicitud.setEstado(false);
        }

        solicitudRepo.save(solicitud);
        return ordenRepo.save(orden);
    }

    @Override
    public List<OrdenCompra> listarTodas() {
        return ordenRepo.findAll();
    }
}
