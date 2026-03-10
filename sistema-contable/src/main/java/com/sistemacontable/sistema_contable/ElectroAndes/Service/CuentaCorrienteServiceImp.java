package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.CuentaCorriente;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleAsiento;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.OrdenCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.CuentaCorrienteRepository;
import com.sistemacontable.sistema_contable.dto.MovimientoCCDto;
import com.sistemacontable.sistema_contable.dto.ResponseCCDto;

@Service
public class CuentaCorrienteServiceImp implements CuentaCorrienteService {

    @Autowired
    private CuentaCorrienteRepository ccRepository;

    @Override
    @Transactional(readOnly = true)
    public ResponseCCDto generarReporte(Long idProveedor) {
        // 1. Buscar la CC asociada al proveedor
        CuentaCorriente cc = ccRepository.findByProveedorId(idProveedor)
                .orElseThrow(() -> new RuntimeException("Cuenta Corriente no encontrada"));

        ResponseCCDto reporte = new ResponseCCDto();
        reporte.setNombreProveedor(cc.getProveedor().getNombre());
        reporte.setSaldoInicial(cc.getSaldoInicial().doubleValue());

        List<MovimientoCCDto> movimientos = new ArrayList<>();
        // Empezamos el cálculo desde el saldo inicial
        BigDecimal saldoCorriendo = cc.getSaldoInicial();

        // 2. Obtener y ordenar las órdenes por fecha
        List<OrdenCompra> ordenes = cc.getOrdenes().stream()
                .sorted(Comparator.comparing(OrdenCompra::getFechaEmision))
                .collect(Collectors.toList());

        // 3. Procesar cada orden y sus asientos
        for (OrdenCompra oc : ordenes) {
            if (oc.getAsientoAsociado() != null) {
                MovimientoCCDto mov = new MovimientoCCDto();
                mov.setFecha(oc.getFechaEmision());
                mov.setComprobante(oc.getNumeroOrdenCompra());
                mov.setDetalle(oc.getObservaciones() != null ? oc.getObservaciones() : "Compra de mercadería");

                // Buscamos el impacto en la cuenta de "Proveedores" (ID 22) en el asiento
                // En una compra a crédito, el proveedor está en el HABER
                double haber = oc.getAsientoAsociado().getDetalles().stream()
                        .filter(d -> d.getCuenta().getId().equals(22L))
                        .mapToDouble(DetalleAsiento::getHaber)
                        .sum();

                double debe = oc.getAsientoAsociado().getDetalles().stream()
                        .filter(d -> d.getCuenta().getId().equals(22L))
                        .mapToDouble(DetalleAsiento::getDebe)
                        .sum();

                mov.setHaber(haber);
                mov.setDebe(debe);

                // Calcular saldo acumulado: SaldoAnterior + Haber - Debe
                saldoCorriendo = saldoCorriendo.add(BigDecimal.valueOf(haber))
                        .subtract(BigDecimal.valueOf(debe));

                mov.setSaldoAcumulado(saldoCorriendo.doubleValue());
                movimientos.add(mov);
            }
        }

        reporte.setMovimientos(movimientos);
        reporte.setSaldoActual(saldoCorriendo.doubleValue());

        return reporte;
    }
}
