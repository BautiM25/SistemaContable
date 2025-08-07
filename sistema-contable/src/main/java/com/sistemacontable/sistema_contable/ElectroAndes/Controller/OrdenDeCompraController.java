// Archivo: src/main/java/com/sistemacontable/sistema_contable/ElectroAndes/controller/OrdenCompraController.java
package com.sistemacontable.sistema_contable.ElectroAndes.Controller;

import com.sistemacontable.sistema_contable.dto.*;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.OrdenDeCompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordenes-compra")
public class OrdenDeCompraController {

    @Autowired
    private OrdenDeCompraService ordenCompraService;

    @PostMapping
    public ResponseEntity<OrdenDeCompraResponse> createOrden(@RequestBody OrdenDeCompraDto ordenDto) {
        OrdenDeCompraResponse response = ordenCompraService.createOrdenFromDto(ordenDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{ordenId}/detalles")
    public ResponseEntity<DetalleOrdenResponse> addDetalle(
            @PathVariable Long ordenId,
            @RequestBody DetalleOrdenDto detalleDto) {
        DetalleOrdenResponse response = ordenCompraService.addDetalleFromDto(ordenId, detalleDto);
        return ResponseEntity.ok(response);
    }
}