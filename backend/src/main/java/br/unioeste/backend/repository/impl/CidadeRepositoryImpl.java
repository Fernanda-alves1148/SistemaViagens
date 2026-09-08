package br.unioeste.backend.repository.impl;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.Cidade;
import br.unioeste.backend.repository.CidadeRepository;

@Repository
public class CidadeRepositoryImpl implements CidadeRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Cidade> findById(Integer id) {
        Cidade cidade = em.find(Cidade.class, id);
        return Optional.ofNullable(cidade);
    }

    @Override
    public List<Cidade> findAll() {
        return em.createQuery("SELECT c FROM Cidade c ORDER BY c.nome", Cidade.class)
                 .getResultList();
    }
}