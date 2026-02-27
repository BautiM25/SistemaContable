package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemacontable.sistema_contable.ElectroAndes.Service.SolicitudCompraService;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.SolicitudCompraMapper;
import com.sistemacontable.sistema_contable.dto.CreateSolicitudCompraDto;
import com.sistemacontable.sistema_contable.dto.ResponseSolicitudCompraDto;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitudCompraController {

    @Autowired
    private SolicitudCompraService solicitudService;
    @Autowired
    private SolicitudCompraMapper solicitudMapper;

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

    // 4. OBTENER POR NÚMERO DE SOLICITUD
    @GetMapping("/numero/{numero}")
    public ResponseEntity<?> obtenerPorNumero(@PathVariable String numero) {
        try {
            var solicitud = solicitudService.obtenerPorNumero(numero);
            return ResponseEntity.ok(solicitudMapper.toDto(solicitud));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la búsqueda");
        }
    }
}
