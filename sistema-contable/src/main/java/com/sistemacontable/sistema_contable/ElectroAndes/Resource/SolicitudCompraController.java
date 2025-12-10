// src/main/java/com/sistemacontable/sistema_contable/ElectroAndes/Resource/SolicitudCompraController.java
package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import com.sistemacontable.sistema_contable.ElectroAndes.Service.SolicitudCompraService;
import com.sistemacontable.sistema_contable.dto.CreateSolicitudCompraDto;
import com.sistemacontable.sistema_contable.dto.ResponseSolicitudCompraDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes-compra")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitudCompraController {

    private final SolicitudCompraService solicitudCompraService;

    public SolicitudCompraController(SolicitudCompraService solicitudCompraService) {
        this.solicitudCompraService = solicitudCompraService;
    }

    // ===================================================
    // 1. POST: /create
    // ===================================================
    @PostMapping(value = "/create")
    public ResponseEntity<?> create(@RequestBody CreateSolicitudCompraDto dto) {
        try {
            ResponseSolicitudCompraDto solicitud = solicitudCompraService.createSolicitud(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(solicitud);
        } catch (IllegalArgumentException e) {
            // Error de unicidad
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (EntityNotFoundException e) {
            // Error de Artículo o Usuario no encontrado
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error interno al crear la Solicitud de Compra."));
        }
    }

    // ===================================================
    // 2. GET: /list
    // ===================================================
    @GetMapping(value = "/list")
    public ResponseEntity<List<ResponseSolicitudCompraDto>> getAll() {
        return ResponseEntity.ok(solicitudCompraService.getAllSolicitudes());
    }

    // ===================================================
    // 3. GET: /search/{id}
    // ===================================================
    @GetMapping("/search/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(solicitudCompraService.getSolicitudById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al obtener la Solicitud."));
        }
    }

    // ===================================================
    // 4. PUT: /status/{id} - Aprobar/Rechazar Solicitud
    // ===================================================
    @PutMapping("/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        try {
            String newStatus = statusUpdate.get("newStatus");
            if (newStatus == null || newStatus.trim().isEmpty()) {
                 return ResponseEntity.badRequest().body(Map.of("error", "El campo 'newStatus' es requerido."));
            }
            ResponseSolicitudCompraDto updatedSolicitud = solicitudCompraService.changeSolicitudStatus(id, newStatus);
            return ResponseEntity.ok(updatedSolicitud);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Error al actualizar el estado de la Solicitud."));
        }
    }
}