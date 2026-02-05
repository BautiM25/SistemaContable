package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.util.List;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.OrdenCompra;
import com.sistemacontable.sistema_contable.dto.CreateOrdenCompraDto;

public interface OrdenCompraService {
    OrdenCompra generarDesdeSolicitud(CreateOrdenCompraDto dto);
    List<OrdenCompra> listarTodas();
}