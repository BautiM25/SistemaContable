package com.sistemacontable.sistema_contable.ElectroAndes.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemacontable.sistema_contable.ElectroAndes.Service.CuentaCorrienteService;
import com.sistemacontable.sistema_contable.dto.ResponseCCDto;

@RestController
@RequestMapping("/api/cuentas-corrientes")
@CrossOrigin("*")
public class CuentaCorrienteController {

    @Autowired
    private CuentaCorrienteService ccService;

    @GetMapping("/proveedor/{idProveedor}")
    public ResponseEntity<ResponseCCDto> generarCuenta(@PathVariable Long idProveedor) {
        return ResponseEntity.ok(ccService.generarReporte(idProveedor));
    }
}
