package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import com.sistemacontable.sistema_contable.dto.CuentaDTO;
import com.sistemacontable.sistema_contable.ElectroAndes.Service.CuentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuentas")
@CrossOrigin(origins = "*") // esto me dice que es para el origen de frontend, no entendi pero lo dejo
public class CuentaController {

    private final CuentaService cuentaServicio;

    @Autowired
    public CuentaController(CuentaService cuentaServicio) {
        this.cuentaServicio = cuentaServicio;
    }

    // GET: Listar todas las cuentas
    @GetMapping
    public ResponseEntity<List<CuentaDTO>> listarTodas() {
        return ResponseEntity.ok(cuentaServicio.obtenerTodasLasCuentas());
    }

    // GET: Obtener una cuenta por ID
    @GetMapping("/{id}")
    public ResponseEntity<CuentaDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cuentaServicio.obtenerCuentaPorId(id));
    }

    // POST: Crear una nueva cuenta
    @PostMapping
    public ResponseEntity<CuentaDTO> crear(@RequestBody CuentaDTO dto) {
        CuentaDTO nuevaCuenta = cuentaServicio.crearCuenta(dto);
        return ResponseEntity.ok(nuevaCuenta);
    }

    // PUT: Actualizar una cuenta existente
    @PutMapping("/{id}")
    public ResponseEntity<CuentaDTO> actualizar(@PathVariable Long id, @RequestBody CuentaDTO dto) {
        CuentaDTO actualizada = cuentaServicio.actualizarCuenta(id, dto);
        return ResponseEntity.ok(actualizada);
    }

    // DELETE: Eliminar una cuenta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        cuentaServicio.eliminarCuenta(id);
        return ResponseEntity.noContent().build();
    }

    // GET: Ver jerarquía de cuentas en formato indentado y numerado
    @GetMapping("/jerarquia")
    public ResponseEntity<List<String>> obtenerJerarquiaNumerada() {
        List<String> jerarquia = cuentaServicio.obtenerCuentasJerarquicasNumeradas();
        return ResponseEntity.ok(jerarquia);
    }
}
