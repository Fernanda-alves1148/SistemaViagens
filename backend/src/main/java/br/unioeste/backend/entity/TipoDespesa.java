package br.unioeste.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tipo_despesa")
public class TipoDespesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tipo")
    private Integer id;

    @Column(name = "nome", nullable = false, length = 50, unique = true)
    private String nome;

    protected TipoDespesa() {
    }

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }
}