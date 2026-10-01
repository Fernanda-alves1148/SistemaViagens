package br.unioeste.backend.repository.impl;

import java.util.Optional;
import java.util.List;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.Endereco;
import br.unioeste.backend.repository.EnderecoRepository;

@Repository
public class EnderecoRepositoryImpl implements EnderecoRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Endereco> findById(Integer id) {
        return Optional.ofNullable(em.find(Endereco.class, id));
    }
    @Override
public List<Endereco> findAll() {
    return em.createQuery(
        "SELECT e FROM Endereco e ORDER BY e.id",
        Endereco.class
    ).getResultList();
}
}