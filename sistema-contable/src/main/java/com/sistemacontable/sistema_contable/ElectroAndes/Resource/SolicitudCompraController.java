package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.SolicitudCompraService;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.SolicitudCompraMapper;
import com.sistemacontable.sistema_contable.dto.CreateSolicitudCompraDto;
import com.sistemacontable.sistema_contable.dto.ResponseSolicitudCompraDto;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitudCompraController {

    @Autowired private SolicitudCompraService solicitudService;
    @Autowired private SolicitudCompraMapper solicitudMapper;

    @PostMapping("/create")
    public ResponseEntity<?> crear(@RequestBody CreateSolicitudCompraDto dto) {
        try {
            var entidad = solicitudService.crear(dto);
            return ResponseEntity.ok(solicitudMapper.toDto(entidad));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear solicitud: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ResponseSolicitudCompraDto>> listar() {
        var lista = solicitudService.obtenerActivas();
        return ResponseEntity.ok(solicitudMapper.toDtoList(lista));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            var solicitud = solicitudService.obtenerPorId(id);
            return ResponseEntity.ok(solicitudMapper.toDto(solicitud));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Solicitud no encontrada");
        }
    }
}