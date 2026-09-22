package br.unioeste.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "uf")
public class Uf {

    @Id
    @Column(name = "sigla_uf", length = 2)
    private String sigla;

    @Column(name = "nome", nullable = false, length = 50, unique = true)
    private String nome;

    protected Uf() {
    }

    public String getSigla() {
        return sigla;
    }

    public String getNome() {
        return nome;
    }
}