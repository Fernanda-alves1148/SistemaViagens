package br.unioeste.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tipo_logradouro")
public class TipoLogradouro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo_log")
    private Integer id;

    @Column(name = "descricao", nullable = false, length = 30, unique = true)
    private String descricao;

    protected TipoLogradouro() {
    }

    public Integer getId() {
        return id;
    }

    public String getDescricao() {
        return descricao;
    }
}