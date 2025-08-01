package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByActivoTrueOrderByNombreAsc();
    List<Producto> findByStockActualLessThanEqualAndActivoTrueOrderByNombreAsc();
}