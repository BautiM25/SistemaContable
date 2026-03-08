package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Asiento;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.CuentaCorriente;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleOrdenCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleSolicitud;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.OrdenCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Proveedor;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.SolicitudCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ArticleRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.CuentaRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.OrdenCompraRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.ProveedorRepository;
import com.sistemacontable.sistema_contable.ElectroAndes.Repository.SolicitudCompraRepository;
import com.sistemacontable.sistema_contable.dto.CreateAsientoDto;
import com.sistemacontable.sistema_contable.dto.CreateDetalleAsientoDto;
import com.sistemacontable.sistema_contable.dto.CreateDetalleOrdenCompraDto;
import com.sistemacontable.sistema_contable.dto.CreateOrdenCompraDto;

import jakarta.transaction.Transactional;

@Service
public class OrdenCompraServiceImp implements OrdenCompraService {

    @Autowired
    private OrdenCompraRepository ordenRepo;
    @Autowired
    private SolicitudCompraRepository solicitudRepo;
    @Autowired
    private ProveedorRepository proveedorRepo;

    @Autowired
    private AsientoService asientoService;

    @Autowired
    private ArticleRepository articleRepo;

    @Autowired
    private CuentaRepository cuentaRepository;

    @Override
    @Transactional
    public OrdenCompra generarDesdeSolicitud(CreateOrdenCompraDto dto) {
        // 1. Cargar Entidades Base
        SolicitudCompra solicitud = solicitudRepo.findById(dto.getIdSolicitud())
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        Proveedor proveedor = proveedorRepo.findById(dto.getIdProveedor())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        // Obtenemos la Cuenta Corriente del proveedor
        CuentaCorriente cc = proveedor.getCuentaCorriente();

        // 2. Preparar Cabecera de la Orden
        OrdenCompra orden = new OrdenCompra();
        orden.setNumeroOrdenCompra(dto.getNumeroOrdenCompra());
        orden.setFechaEmision(LocalDate.now());
        orden.setSolicitudAsociada(solicitud);
        orden.setProveedor(proveedor);
        orden.setCuentaCorriente(cc); // Vinculamos la OC a la CC
        orden.setCondicionesPago(dto.getCondicionesPago());
        orden.setComprador(dto.getComprador());
        orden.setObservaciones(dto.getObservaciones());

        BigDecimal acumuladoSubtotal = BigDecimal.ZERO;

        // 3. Procesar items: Stock, Solicitud y Detalles de Orden
        for (CreateDetalleOrdenCompraDto itemDto : dto.getDetalles()) {

            // Buscamos el detalle correspondiente en la SOLICITUD
            DetalleSolicitud dSol = solicitud.getDetalles().stream()
                    .filter(ds -> ds.getArticulo().getId().equals(itemDto.getIdArticulo()) && ds.getEstado())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("El artículo " + itemDto.getIdArticulo() + " no está activo en esta solicitud"));

            // --- ACTUALIZAR STOCK DEL ARTÍCULO ---
            Article articulo = dSol.getArticulo(); // [cite: 5, 57]
            articulo.setStockFisico(articulo.getStockFisico() + itemDto.getCantidad().intValue()); // 
            articleRepo.save(articulo); // 

            // --- REGLA DE NEGOCIO: Actualizar Solicitud ---
            if (itemDto.getCantidad() >= dSol.getCantidad()) {
                dSol.setCantidad(0.0);
                dSol.setEstado(false);
            } else {
                dSol.setCantidad(dSol.getCantidad() - itemDto.getCantidad());
            }

            // --- Crear Detalle de la Orden ---
            DetalleOrdenCompra dOrd = new DetalleOrdenCompra();
            dOrd.setOrdenCompra(orden);
            dOrd.setArticulo(articulo);
            dOrd.setCantidad(itemDto.getCantidad());
            dOrd.setPrecioUnitario(itemDto.getPrecioUnitario());
            dOrd.setMedida(itemDto.getMedida());

            orden.getDetalles().add(dOrd);

            // Cálculo financiero
            BigDecimal linea = itemDto.getPrecioUnitario().multiply(BigDecimal.valueOf(itemDto.getCantidad()));
            acumuladoSubtotal = acumuladoSubtotal.add(linea);
        }

        // 4. Totales de la Orden
        orden.setSubtotal(acumuladoSubtotal);
        orden.setIva(acumuladoSubtotal.multiply(new BigDecimal("0.21")));
        orden.setTotal(orden.getSubtotal().add(orden.getIva()));
        orden.setMoneda(orden.getDetalles().get(0).getArticulo().getDivisa()); // [cite: 5, 57]

        // 5. GENERAR ASIENTO CONTABLE (Usa el AsientoService que me pasaste)
        CreateAsientoDto asientoDto = new CreateAsientoDto();
        asientoDto.setFecha(LocalDate.now()); // Fecha del asiento = fecha de emisión de la OC
        asientoDto.setDescripcion("Compra s/ OC: " + orden.getNumeroOrdenCompra());
        asientoDto.setCreador(1L); // ID del usuario comprador (Luka) 

        List<CreateDetalleAsientoDto> detallesAsiento = new ArrayList<>();

        // DEBE: Mercaderías (Cuenta de Activo) por el Subtotal
        detallesAsiento.add(new CreateDetalleAsientoDto(Long.valueOf(15), orden.getSubtotal().doubleValue(), 0.0));
        // HABER: Proveedores (Cuenta de Pasivo) por el Total
        detallesAsiento.add(new CreateDetalleAsientoDto(Long.valueOf(22), 0.0, orden.getTotal().doubleValue()));

        asientoDto.setDetalles(detallesAsiento);

        // Llamamos al servicio para validar partida doble y saldos negativos 
        Asiento asientoCreado = asientoService.crearAsiento(asientoDto);
        orden.setAsientoAsociado(asientoCreado); // Vinculamos la OC con su Asiento 

        // 6. ACTUALIZAR CUENTA CORRIENTE (Mayor del Proveedor)
        // Según tu lógica: Aumenta por el DEBE
        BigDecimal montoTotal = orden.getTotal();
        cc.setSaldoActual(cc.getSaldoActual().add(montoTotal));

        // 7. Persistir todos los cambios
        proveedorRepo.save(proveedor);
        solicitud.setFechaEmisionOC(LocalDate.now());

        boolean tieneItemsPendientes = solicitud.getDetalles().stream().anyMatch(DetalleSolicitud::getEstado);
        if (!tieneItemsPendientes) {
            solicitud.setEstado(false);
        }

        solicitudRepo.save(solicitud);
        return ordenRepo.save(orden);
    }

    @Override
    public List<OrdenCompra> listarTodas() {
        return ordenRepo.findAll();
    }
}
