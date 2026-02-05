package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.OrdenCompraService;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.OrdenCompraMapper;
import com.sistemacontable.sistema_contable.dto.CreateOrdenCompraDto;
import com.sistemacontable.sistema_contable.dto.ResponseOrdenCompraDto;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "http://localhost:5173")
public class OrdenCompraController {

    @Autowired private OrdenCompraService ordenService;
    @Autowired private OrdenCompraMapper ordenMapper;

    @PostMapping("/generar-desde-solicitud")
    public ResponseEntity<?> generar(@RequestBody CreateOrdenCompraDto dto) {
        try {
            var ordenCreada = ordenService.generarDesdeSolicitud(dto);
            return ResponseEntity.ok(ordenMapper.toDto(ordenCreada));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al generar la orden: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ResponseOrdenCompraDto>> listar() {
        var ordenes = ordenService.listarTodas();
        return ResponseEntity.ok(ordenMapper.toDtoList(ordenes));
    }
}