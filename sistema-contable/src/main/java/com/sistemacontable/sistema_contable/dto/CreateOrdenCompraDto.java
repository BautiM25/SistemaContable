package com.sistemacontable.sistema_contable.dto;

public class CreateOrdenCompraDto {
    private String numeroOrdenCompra;
    private Long idSolicitud;
    private Long idProveedor;
    private String condicionesPago;
    private String observaciones;
    private String comprador;
    
    public String getNumeroOrdenCompra() {
        return numeroOrdenCompra;
    }
    public void setNumeroOrdenCompra(String numeroOrdenCompra) {
        this.numeroOrdenCompra = numeroOrdenCompra;
    }
    public Long getIdSolicitud() {
        return idSolicitud;
    }
    public void setIdSolicitud(Long idSolicitud) {
        this.idSolicitud = idSolicitud;
    }
    public Long getIdProveedor() {
        return idProveedor;
    }
    public void setIdProveedor(Long idProveedor) {
        this.idProveedor = idProveedor;
    }
    public String getCondicionesPago() {
        return condicionesPago;
    }
    public void setCondicionesPago(String condicionesPago) {
        this.condicionesPago = condicionesPago;
    }
    public String getObservaciones() {
        return observaciones;
    }
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    public String getComprador() {
        return comprador;
    }
    public void setComprador(String comprador) {
        this.comprador = comprador;
    }    
}
