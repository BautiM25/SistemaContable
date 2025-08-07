package com.sistemacontable.sistema_contable.ElectroAndes.Repository;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleSolicitudCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleSolicitudCompraRepository extends JpaRepository<DetalleSolicitudCompra, Long> {}
