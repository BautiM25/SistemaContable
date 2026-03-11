package com.sistemacontable.sistema_contable.ElectroAndes.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sistemacontable.sistema_contable.ElectroAndes.Model.Article;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Asiento;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.CategoriaIva;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.CuentaCorriente;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleOrdenCompra;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.DetalleSolicitud;
import com.sistemacontable.sistema_contable.ElectroAndes.Model.Divisa;
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

    @Autowired private OrdenCompraRepository ordenRepo;
    @Autowired private SolicitudCompraRepository solicitudRepo;
    @Autowired private ProveedorRepository proveedorRepo;
    @Autowired private AsientoService asientoService;
    @Autowired private ArticleRepository articleRepo;
    @Autowired private CuentaRepository cuentaRepository;

    @Override
    @Transactional
    public OrdenCompra generarDesdeSolicitud(CreateOrdenCompraDto dto) {
        // 1. Cargar Entidades Base
        SolicitudCompra solicitud = solicitudRepo.findById(dto.getIdSolicitud())
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        Proveedor proveedor = proveedorRepo.findById(dto.getIdProveedor())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        CuentaCorriente cc = proveedor.getCuentaCorriente();

        // 2. Verificar categoría de IVA del proveedor
        boolean proveedorEsResponsableInscripto = proveedor.getCategoriaIva() == CategoriaIva.RESPONSABLE_INSCRIPTO;
        
        // Log para debugging
        System.out.println("===== IVA DEBUG =====");
        System.out.println("Proveedor: " + proveedor.getNombre());
        System.out.println("Categoría IVA: " + proveedor.getCategoriaIva());
        System.out.println("¿Es Responsable Inscripto? " + proveedorEsResponsableInscripto);
        System.out.println("=====================");

        // 3. Preparar Cabecera de la Orden
        OrdenCompra orden = new OrdenCompra();
        orden.setNumeroOrdenCompra(dto.getNumeroOrdenCompra());
        orden.setFechaEmision(LocalDate.now());
        orden.setSolicitudAsociada(solicitud);
        orden.setProveedor(proveedor);
        orden.setCuentaCorriente(cc); 
        orden.setCondicionesPago(dto.getCondicionesPago());
        orden.setComprador(dto.getComprador());
        orden.setObservaciones(dto.getObservaciones());

        BigDecimal acumuladoSubtotal = BigDecimal.ZERO;
        Divisa divisaPorDefecto = Divisa.ARS; // Valor por defecto

        // 4. Procesar items: Stock, Solicitud y Detalles de Orden
        for (CreateDetalleOrdenCompraDto itemDto : dto.getDetalles()) {
            DetalleSolicitud dSol = solicitud.getDetalles().stream()
                    .filter(ds -> ds.getArticulo().getId().equals(itemDto.getIdArticulo()) && ds.getEstado())
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Artículo no activo en solicitud"));

            // Actualizar Stock
            Article articulo = dSol.getArticulo();
            articulo.setStockFisico(articulo.getStockFisico() + itemDto.getCantidad().intValue());
            articleRepo.save(articulo);

            // Actualizar Solicitud
            if (itemDto.getCantidad() >= dSol.getCantidadFaltante()) {
                dSol.setCantidadFaltante(0.0);
                dSol.setEstado(false);
            } else {
                dSol.setCantidadFaltante(dSol.getCantidadFaltante() - itemDto.getCantidad());
            }

            // Crear Detalle de la Orden
            DetalleOrdenCompra dOrd = new DetalleOrdenCompra();
            dOrd.setOrdenCompra(orden);
            dOrd.setArticulo(articulo);
            dOrd.setCantidad(itemDto.getCantidad());
            dOrd.setPrecioUnitario(itemDto.getPrecioUnitario());
            dOrd.setMedida(itemDto.getMedida());

            orden.getDetalles().add(dOrd);

            BigDecimal linea = itemDto.getPrecioUnitario().multiply(BigDecimal.valueOf(itemDto.getCantidad()));
            acumuladoSubtotal = acumuladoSubtotal.add(linea);
            
            // 🔥 CORREGIDO: Obtener la divisa del primer artículo (ahora como enum)
            if (articulo.getDivisa() != null) {
                divisaPorDefecto = articulo.getDivisa();
            }
        }

        // 5. Totales de la Orden (AHORA CONDICIONAL)
        orden.setSubtotal(acumuladoSubtotal);
        
        BigDecimal iva = BigDecimal.ZERO;
        BigDecimal total = orden.getSubtotal();

        if (proveedorEsResponsableInscripto) {
            iva = acumuladoSubtotal.multiply(new BigDecimal("0.21"));
            total = orden.getSubtotal().add(iva);
            System.out.println("✅ Proveedor RI - Aplicando IVA: $" + iva);
        } else {
            System.out.println("⛔ Proveedor no RI - Sin IVA");
        }

        orden.setIva(iva);
        orden.setTotal(total);
        orden.setMoneda(divisaPorDefecto);

        // 6. GENERAR ASIENTO CONTABLE (AHORA CONDICIONAL)
        CreateAsientoDto asientoDto = new CreateAsientoDto();
        asientoDto.setFecha(LocalDate.now());
        asientoDto.setDescripcion("Compra s/ OC: " + orden.getNumeroOrdenCompra() + " - Prov: " + proveedor.getNombre());
        asientoDto.setCreador(2L); 

        List<CreateDetalleAsientoDto> detallesAsiento = new ArrayList<>();

        // DEBE: Mercaderías (ID 15) - SIEMPRE VA
        detallesAsiento.add(new CreateDetalleAsientoDto(15L, orden.getSubtotal().doubleValue(), 0.0));

        // DEBE: IVA Crédito Fiscal (ID 40) - SOLO SI EL PROVEEDOR ES RI
        if (proveedorEsResponsableInscripto && iva.compareTo(BigDecimal.ZERO) > 0) {
            detallesAsiento.add(new CreateDetalleAsientoDto(40L, orden.getIva().doubleValue(), 0.0));
            System.out.println("✅ Agregando línea de IVA Crédito Fiscal");
        }

        // Determinamos la cuenta del HABER según condición
        Long cuentaHaberId;
        boolean esContado = "CONTADO".equalsIgnoreCase(dto.getCondicionesPago());
        
        if (esContado) {
            cuentaHaberId = 7L; // ID de la cuenta CAJA
        } else {
            cuentaHaberId = 22L; // ID de la cuenta PROVEEDORES
        }

        // HABER: Al final de la lista por el TOTAL
        detallesAsiento.add(new CreateDetalleAsientoDto(
            cuentaHaberId, 
            0.0, 
            orden.getTotal().doubleValue()
        ));

        asientoDto.setDetalles(detallesAsiento);
        
        // Verificar balance del asiento
        double totalDebe = detallesAsiento.stream().mapToDouble(CreateDetalleAsientoDto::getDebe).sum();
        double totalHaber = detallesAsiento.stream().mapToDouble(CreateDetalleAsientoDto::getHaber).sum();
        System.out.println("Balance asiento - Debe: $" + totalDebe + " | Haber: $" + totalHaber);
        
        Asiento asientoCreado = asientoService.crearAsiento(asientoDto);
        orden.setAsientoAsociado(asientoCreado);

        // 7. ACTUALIZAR CUENTA CORRIENTE
        // Solo aumentamos el saldo si la compra es a CRÉDITO
        if (!esContado && cc != null) {
            cc.setSaldoActual(cc.getSaldoActual().add(orden.getTotal()));
        }

        // 8. Persistir cambios en Solicitud y Orden
        solicitud.setFechaEmisionOC(LocalDate.now());
        boolean tieneItemsPendientes = solicitud.getDetalles().stream().anyMatch(DetalleSolicitud::getEstado);
        if (!tieneItemsPendientes) {
            solicitud.setEstado(false);
        }

        solicitudRepo.save(solicitud);
        OrdenCompra ordenGuardada = ordenRepo.save(orden);
        
        System.out.println("✅ Orden generada exitosamente. ID: " + ordenGuardada.getId());
        return ordenGuardada;
    }

    @Override
    public List<OrdenCompra> listarTodas() {
        return ordenRepo.findAll();
    }
}