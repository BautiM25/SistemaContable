package com.sistemacontable.sistema_contable.ElectroAndes.Resource;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleSolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.SolicitudCompraService;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.SolicitudCompraMapper;
import com.sistemacontable.sistema_contable.dto.DetalleSolicitudCompraDTO;
import com.sistemacontable.sistema_contable.dto.SolicitudCompraDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/solicitudes-compra")
@CrossOrigin(origins = "*")
public class SolicitudCompraController {

    private final SolicitudCompraService service;
    private final SolicitudCompraMapper mapper;

    public SolicitudCompraController(
            SolicitudCompraService service,
            SolicitudCompraMapper mapper
    ) {
        this.service = service;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<SolicitudCompra> crear(
            @RequestBody SolicitudCompraDTO dto
    ) {
        SolicitudCompra solicitud = mapper.toEntity(dto);
        return ResponseEntity.ok(service.guardar(solicitud));
    }
}
