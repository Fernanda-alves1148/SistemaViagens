package br.unioeste.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cargo")
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cargo")
    private Integer id;

    @Column(name = "nome", nullable = false, length = 50, unique = true)
    private String nome;

    protected Cargo() {
    }

    public Cargo(String nome) {
    this.nome = nome;
}

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }
}