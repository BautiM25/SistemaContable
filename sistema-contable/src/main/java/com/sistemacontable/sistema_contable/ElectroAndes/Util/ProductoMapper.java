package com.sistemacontable.sistema_contable.ElectroAndes.Util;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Producto;
import com.sistemacontable.sistema_contable.dto.ProductoDTO;


import java.util.List;

public class ProductoMapper {

    // DTO -> ENTITY
    public static Producto toEntity(ProductoDTO dto/*, ProveedorRepository proveedorRepository */) {
        Producto producto = new Producto();
        producto.setCodigo(dto.getCodigo());
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setCategoria(dto.getCategoria());
        producto.setPrecioCompra(dto.getPrecioCompra());
        producto.setPrecioVenta(dto.getPrecioVenta());
        producto.setStockMinimo((double) dto.getStockMinimo());
        producto.setPresentacion(dto.getPresentacion());
        producto.setActivo(dto.isActivo());
        producto.setIvaCompra(dto.getIvaCompra());
        producto.setIvaVenta(dto.getIvaVenta());
// producto.setProveedores(...) si corresponde


        producto.setActivo(dto.isActivo());
        producto.setIvaCompra(dto.getIvaCompra());
        producto.setIvaVenta(dto.getIvaVenta());

        if (dto.getIdProducto() != null) {
            producto.setId(dto.getIdProducto().longValue());
        }

        // Comentado hasta que implementes la relación con proveedores
    /*
    if (dto.getProveedoresIds() != null && !dto.getProveedoresIds().isEmpty()) {
        List<ProductoProveedor> relaciones = dto.getProveedoresIds().stream()
                .map(idProveedor -> {
                    Proveedor proveedor = proveedorRepository.findById(idProveedor)
                            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado: " + idProveedor));
                    return new ProductoProveedor(producto, proveedor);
                })
                .collect(Collectors.toList());

        producto.setProveedores(relaciones);
    }
    */

        return producto;
    }

    // ENTITY -> DTO
    public static ProductoDTO toDTO(Producto producto) {
        // También podés dejar esto en null mientras no uses proveedores
        List<Long> proveedorIds = null;
    /*
    List<Long> proveedorIds = producto.getProveedores() != null
            ? producto.getProveedores().stream()
            .map(pp -> pp.getProveedor().getId())
            .collect(Collectors.toList())
            : null;
    */

        return new ProductoDTO(
                producto.getId().intValue(),
                producto.getCodigo(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getCategoria(),
                producto.getPrecioCompra(),
                producto.getPrecioVenta(),
                producto.getStockMinimo().intValue(),
                producto.getPresentacion(),
                producto.getIvaCompra(),
                producto.getIvaVenta(),
                producto.getActivo() != null ? producto.getActivo() : true,
                proveedorIds
        );
    }

}