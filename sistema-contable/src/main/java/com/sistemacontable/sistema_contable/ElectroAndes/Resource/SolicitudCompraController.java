package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.SolicitudCompraService;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.SolicitudCompraMapper;
import com.sistemacontable.sistema_contable.dto.SolicitudCompraDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = "*")
public class SolicitudCompraController {

    private final SolicitudCompraService service;
    private final SolicitudCompraMapper mapper;

    public SolicitudCompraController(SolicitudCompraService service, SolicitudCompraMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public List<SolicitudCompra> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudCompra> buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SolicitudCompra> crear(@RequestBody SolicitudCompraDTO dto) {
        SolicitudCompra solicitud = mapper.toEntity(dto);
        return ResponseEntity.ok(service.guardar(solicitud));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (service.buscarPorId(id).isPresent()) {
            service.eliminar(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

