// Archivo: src/main/java/com/sistemacontable/sistema_contable/ElectroAndes/service/OrdenDeCompraService.java
package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.dto.*;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.*;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@Transactional
public class OrdenDeCompraService {

    @Autowired
    private OrdenDeCompraRepository ordenDeCompraRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public OrdenDeCompraResponse createOrdenFromDto(OrdenDeCompraDto ordenDto) {
        OrdenDeCompra orden = new OrdenDeCompra();
        orden.setFechaEmision(ordenDto.getFechaEmision());
        orden.setNroOrden(ordenDto.getNroOrden());

        Proveedor proveedor = proveedorRepository.findById(ordenDto.getIdProveedor())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        orden.setProveedor(proveedor);

        Usuario usuario = usuarioRepository.findById(ordenDto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        orden.setUsuario(usuario);

        OrdenDeCompra savedOrden = ordenDeCompraRepository.save(orden);

        if(ordenDto.getDetalles() != null && !ordenDto.getDetalles().isEmpty()) {
            for(DetalleOrdenDto detalleDto : ordenDto.getDetalles()) {
                addDetalleFromDto(savedOrden.getId(), detalleDto);
            }
        }

        return convertToResponse(savedOrden);
    }

    public DetalleOrdenResponse addDetalleFromDto(Long ordenId, DetalleOrdenDto detalleDto) {
        DetalleOrden detalle = new DetalleOrden();
        detalle.setCantidad(detalleDto.getCantidad());
        detalle.setPrecioUnitario(detalleDto.getPrecioUnitario());
        detalle.setDescripcion(detalleDto.getDescripcion());

        Producto producto = productoRepository.findById(detalleDto.getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        detalle.setProducto(producto);

        OrdenDeCompra orden = ordenDeCompraRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

        detalle.setOrden(orden);
        if(orden.getDetalles() == null) {
            orden.setDetalles(new java.util.ArrayList<>());
        }
        orden.getDetalles().add(detalle);

        ordenDeCompraRepository.save(orden);

        return convertDetalleToResponse(detalle);
    }

    private OrdenDeCompraResponse convertToResponse(OrdenDeCompra orden) {
        OrdenDeCompraResponse response = new OrdenDeCompraResponse();
        response.setId(orden.getId());
        response.setFechaEmision(orden.getFechaEmision());
        response.setNroOrden(orden.getNroOrden());
        response.setProveedorNombre(orden.getProveedor().getRazonSocial());
        response.setUsuarioNombre(orden.getUsuario().getNombreCompleto());

        if(orden.getDetalles() != null) {
            response.setDetalles(orden.getDetalles().stream()
                    .map(this::convertDetalleToResponse)
                    .collect(Collectors.toList()));
        }

        return response;
    }

    private DetalleOrdenResponse convertDetalleToResponse(DetalleOrden detalle) {
        DetalleOrdenResponse response = new DetalleOrdenResponse();
        response.setProductoNombre(detalle.getProducto().getNombre());
        response.setCantidad(detalle.getCantidad());
        response.setPrecioUnitario(detalle.getPrecioUnitario());
        response.setSubtotal(detalle.getPrecioUnitario() * detalle.getCantidad());
        response.setDescripcion(detalle.getDescripcion());
        return response;
    }
}