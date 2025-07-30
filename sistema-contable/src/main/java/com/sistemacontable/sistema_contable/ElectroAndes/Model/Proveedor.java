package com.sistemacontable.sistema_contable.ElectroAndes.Model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

    @Entity
    @Table(name = "proveedores")
    public class Proveedor {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String razonSocial;
        private int telefono;
        private int cuit;
        private String rubro;
        private String direccion;

        // Constructores
        public Proveedor() {
        }

        public Proveedor(String razonSocial, int telefono, int cuit, String rubro, String direccion) {
            this.razonSocial = razonSocial;
            this.telefono = telefono;
            this.cuit = cuit;
            this.rubro = rubro;
            this.direccion = direccion;
        }

        // Getters y Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getRazonSocial() {
            return razonSocial;
        }

        public void setRazonSocial(String razonSocial) {
            this.razonSocial = razonSocial;
        }

        public int getTelefono() {
            return telefono;
        }

        public void setTelefono(int telefono) {
            this.telefono = telefono;
        }

        public int getCuit() {
            return cuit;
        }

        public void setCuit(int cuit) {
            this.cuit = cuit;
        }

        public String getRubro() {
            return rubro;
        }

        public void setRubro(String rubro) {
            this.rubro = rubro;
        }

        public String getDireccion() {
            return direccion;
        }

        public void setDireccion(String direccion) {
            this.direccion = direccion;
        }

        // toString (opcional)
        @Override
        public String toString() {
            return "Proveedor{" +
                    "id=" + id +
                    ", razonSocial='" + razonSocial + '\'' +
                    ", telefono=" + telefono +
                    ", cuit=" + cuit +
                    ", rubro='" + rubro + '\'' +
                    ", direccion='" + direccion + '\'' +
                    '}';
        }
    }

