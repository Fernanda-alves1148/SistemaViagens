package br.unioeste.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "empregado")
public class Empregado extends Pessoa {

    @Id
    @Column(name = "matricula", length = 6)
    private String matricula;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo;

    protected Empregado() {
    }

    public String getMatricula() {
        return matricula;
    }

    public Boolean getAtivo() {
        return ativo;
    }
}