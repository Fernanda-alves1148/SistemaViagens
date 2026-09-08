package br.unioeste.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class Pessoa {

    @Column(name = "nome", nullable = false, length = 100)
    protected String nome;

    @Column(name = "cpf", nullable = false, length = 14, unique = true)
    protected String cpf;

    @ManyToOne
    @JoinColumn(name = "id_endereco")
    protected Endereco endereco;

    public String getNome() {
        return nome;
    }

    public String getCpf() {
        return cpf;
    }

    public Endereco getEndereco() {
        return endereco;
    }
}