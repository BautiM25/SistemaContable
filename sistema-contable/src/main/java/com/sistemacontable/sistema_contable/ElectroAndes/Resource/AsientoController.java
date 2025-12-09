package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Asiento;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.AsientoService;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.AsientoMapper;
import com.sistemacontable.sistema_contable.ElectroAndes.Util.DetalleAsientoMapper;
import com.sistemacontable.sistema_contable.dto.CreateAsientoDto;
import com.sistemacontable.sistema_contable.dto.DetalleMayorDto;
import com.sistemacontable.sistema_contable.dto.ResponseAsientoDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleAsiento;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/asientos")
@CrossOrigin(origins = "http://localhost:5173")
public class AsientoController {

    @Autowired
    private AsientoService asientoService;

    @Autowired
    private AsientoMapper asientoMapper;

    @Autowired
    private DetalleAsientoMapper detalleAsientoMapper;

    // Crear asiento contable
    @PostMapping("/create")
    public ResponseEntity<?> crearAsiento(@RequestBody CreateAsientoDto dto) {
        try {
            var asientoCreado = asientoService.crearAsiento(dto);
            return ResponseEntity.ok(asientoMapper.mapToDto(asientoCreado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear el asiento: " + e.getMessage());
        }
    }

    // Obtener todos los asientos
    @GetMapping
    public ResponseEntity<List<ResponseAsientoDto>> listarAsientos() {
        List<Asiento> asientos = asientoService.obtenerTodos();
        List<ResponseAsientoDto> dtos = asientoMapper.toDtoList(asientos);
        return ResponseEntity.ok(dtos);
    }

    // Obtener asiento por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Asiento asiento = asientoService.obtenerPorId(id);
            ResponseAsientoDto dto = asientoMapper.mapToDto(asiento);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Asiento no encontrado.");
        }
    }

    // Obtener asientos entre dos fechas
    @GetMapping("/entre-fechas")
    public ResponseEntity<List<ResponseAsientoDto>> obtenerPorFechas(
            @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        List<Asiento> asientos = asientoService.obtenerPorFechas(desde, hasta);
        List<ResponseAsientoDto> dtos = asientoMapper.toDtoList(asientos);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/libro-mayor")
    public ResponseEntity<List<DetalleMayorDto>> obtenerLibroMayor(
            @RequestParam("cuentaId") Long cuentaId,
            @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        
        List<DetalleAsiento> detalles = asientoService.obtenerMayorPorCuentaYFechas(cuentaId, desde, hasta);
        
          // Convertir a DTOs para evitar recursividad
        List<DetalleMayorDto> dtos = detalles.stream()
            .map(detalleAsientoMapper::toMayorDto)
            .collect(Collectors.toList());
    
        return ResponseEntity.ok(dtos);
    }
}
