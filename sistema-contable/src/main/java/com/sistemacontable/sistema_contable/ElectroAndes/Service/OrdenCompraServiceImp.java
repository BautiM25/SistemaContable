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
import com.sistemacontable.sistema_contable.dto.CreateOrdenCompraDto;
import jakarta.transaction.Transactional;

@Service
public class OrdenCompraServiceImp implements OrdenCompraService {

    @Autowired private OrdenCompraRepository ordenRepo;
    @Autowired private SolicitudCompraRepository solicitudRepo;
    @Autowired private ProveedorRepository proveedorRepo;

    @Override
    @Transactional
    public OrdenCompra generarDesdeSolicitud(CreateOrdenCompraDto dto) {
        // 1. Buscar Origen
        SolicitudCompra solicitud = solicitudRepo.findById(dto.getIdSolicitud())
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        Proveedor proveedor = proveedorRepo.findById(dto.getIdProveedor())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        // 2. Crear Cabecera
        OrdenCompra orden = new OrdenCompra();
        orden.setNumeroOrdenCompra(dto.getNumeroOrdenCompra());
        orden.setFechaEmision(LocalDate.now());
        orden.setSolicitudAsociada(solicitud);
        orden.setProveedor(proveedor);
        orden.setCondicionesPago(dto.getCondicionesPago());
        orden.setComprador(dto.getComprador());
        orden.setMoneda(solicitud.getDetalles().get(0).getArticulo().getDivisa());

        BigDecimal acumuladoSubtotal = BigDecimal.ZERO;

        // 3. Transformar Detalle de Solicitud a Detalle de Orden
        for (DetalleSolicitud dSol : solicitud.getDetalles()) {
            DetalleOrdenCompra dOrd = new DetalleOrdenCompra();
            dOrd.setOrdenCompra(orden);
            dOrd.setArticulo(dSol.getArticulo());
            dOrd.setCantidad(dSol.getCantidad());
            dOrd.setMedida(dSol.getMedida());
            
            // Regla de negocio: El precio viene del costoBase del artículo
            BigDecimal precio = dSol.getArticulo().getCostoBase();
            dOrd.setPrecioUnitario(precio);
            
            orden.getDetalles().add(dOrd);

            // Sumar al subtotal: precio * cantidad
            BigDecimal linea = precio.multiply(BigDecimal.valueOf(dSol.getCantidad()));
            acumuladoSubtotal = acumuladoSubtotal.add(linea);
        }

        // 4. Cálculos Impuestos (Usando BigDecimal para precisión)
        orden.setSubtotal(acumuladoSubtotal);
        orden.setIva(acumuladoSubtotal.multiply(new BigDecimal("0.21"))); // IVA 21%
        orden.setTotal(orden.getSubtotal().add(orden.getIva()));

        // 5. Marcar solicitud como procesada
        solicitud.setFechaEmisionOC(LocalDate.now());
        solicitud.setEstado(false); // Ya no está pendiente
        solicitudRepo.save(solicitud);

        return ordenRepo.save(orden);
    }

    @Override public List<OrdenCompra> listarTodas() { return ordenRepo.findAll(); }
}