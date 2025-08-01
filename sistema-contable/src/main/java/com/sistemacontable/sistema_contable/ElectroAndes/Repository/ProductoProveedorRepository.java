package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.ProductoProveedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoProveedorRepository extends JpaRepository<ProductoProveedor, Long> {
    List<ProductoProveedor> findByProductoId(Long productoId);
    List<ProductoProveedor> findByProveedorId(Long proveedorId);
}
