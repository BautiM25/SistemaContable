package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Asiento;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Cuenta;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleAsiento;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Usuario;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.AsientoRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.CuentaRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.DetalleAsientoRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.UsuarioRepository;
import com.sistemacontable.sistema_contable.dto.CreateAsientoDto;
import com.sistemacontable.sistema_contable.dto.CreateDetalleAsientoDto;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class AsientoServiceImp implements AsientoService {

    @Autowired
    private AsientoRepository asientoRepository;

    @Autowired
    private DetalleAsientoRepository detalleAsientoRepository;

    @Autowired
    private CuentaRepository cuentaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Asiento crearAsiento(CreateAsientoDto dto) {
        double totalDebe = 0.0;
        double totalHaber = 0.0;

        // 1. Validar partida doble
        for (CreateDetalleAsientoDto detalleDto : dto.getDetalles()) {
            totalDebe += detalleDto.getDebe() != null ? detalleDto.getDebe() : 0.0;
            totalHaber += detalleDto.getHaber() != null ? detalleDto.getHaber() : 0.0;
        }

        if (Double.compare(totalDebe, totalHaber) != 0) {
            throw new IllegalArgumentException("El asiento no cumple con la partida doble: Debe ≠ Haber.");
        }

        // 2. Validar que ninguna cuenta quede con saldo negativo
        for (CreateDetalleAsientoDto detalleDto : dto.getDetalles()) {
            Cuenta cuenta = cuentaRepository.findById(detalleDto.getCuenta())
                    .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

            double movimiento;
            switch (cuenta.getTipo()) {
                case ACTIVO:
                case EGRESO:
                    movimiento = (detalleDto.getDebe() != null ? detalleDto.getDebe() : 0.0)
                            - (detalleDto.getHaber() != null ? detalleDto.getHaber() : 0.0);
                    break;
                case PASIVO:
                case PATRIMONIO:
                case INGRESO:
                    movimiento = (detalleDto.getHaber() != null ? detalleDto.getHaber() : 0.0)
                            - (detalleDto.getDebe() != null ? detalleDto.getDebe() : 0.0);
                    break;
                default:
                    throw new RuntimeException("Tipo de cuenta no reconocido.");
            }

            double saldoProyectado = cuenta.getSaldo() + movimiento;
            if (saldoProyectado < 0) {
                throw new IllegalArgumentException("El asiento deja saldo negativo en la cuenta: " + cuenta.getNombreCuenta());
            }
        }

        // 3. Crear el Asiento
        Asiento asiento = new Asiento();
        asiento.setFecha(LocalDate.now());
        asiento.setDescripcion(dto.getDescripcion());

        Usuario creador = usuarioRepository.findById(dto.getCreador())
                .orElseThrow(() -> new RuntimeException("Usuario creador no encontrado"));
        asiento.setCreador(creador);

        List<DetalleAsiento> detalles = new ArrayList<>();

        for (CreateDetalleAsientoDto detalleDto : dto.getDetalles()) {
            Cuenta cuenta = cuentaRepository.findById(detalleDto.getCuenta())
                    .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));

            DetalleAsiento detalle = new DetalleAsiento();
            detalle.setAsiento(asiento);
            detalle.setCuenta(cuenta);
            detalle.setDebe(detalleDto.getDebe() != null ? detalleDto.getDebe() : 0.0);
            detalle.setHaber(detalleDto.getHaber() != null ? detalleDto.getHaber() : 0.0);
            detalles.add(detalle);

            // 4. Actualizar saldo de la cuenta
            double movimiento;
            switch (cuenta.getTipo()) {
                case ACTIVO:
                case EGRESO:
                    movimiento = detalle.getDebe() - detalle.getHaber();
                    break;
                case PASIVO:
                case PATRIMONIO:
                case INGRESO:
                    movimiento = detalle.getHaber() - detalle.getDebe();
                    break;
                default:
                    throw new RuntimeException("Tipo de cuenta no reconocido.");
            }

            cuenta.setSaldo(cuenta.getSaldo() + movimiento);
            cuentaRepository.save(cuenta);
        }

        asiento.setDetalles(detalles);
        return asientoRepository.save(asiento);
    }

    @Override
    public List<Asiento> obtenerTodos() {
        return asientoRepository.findAll();
    }

    @Override
    public Asiento obtenerPorId(Long id) {
        return asientoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Asiento no encontrado"));
    }

    @Override
    public List<Asiento> obtenerPorFechas(LocalDate desde, LocalDate hasta) {
        return asientoRepository.findByFechaBetween(desde, hasta);
    }
}
