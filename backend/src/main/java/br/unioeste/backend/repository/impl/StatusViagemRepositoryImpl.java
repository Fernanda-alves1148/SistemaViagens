package br.unioeste.backend.repository.impl;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.StatusViagem;
import br.unioeste.backend.repository.StatusViagemRepository;

@Repository
public class StatusViagemRepositoryImpl implements StatusViagemRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<StatusViagem> findById(Integer id) {
        StatusViagem status = em.find(StatusViagem.class, id);
        return Optional.ofNullable(status);
    }

    @Override
    public Optional<StatusViagem> findByNomeIgnoreCase(String nome) {
        try {
            StatusViagem status = em.createQuery(
                    "SELECT s FROM StatusViagem s WHERE LOWER(s.nome) = LOWER(:nome)",
                    StatusViagem.class)
                .setParameter("nome", nome)
                .getSingleResult();
            return Optional.of(status);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<StatusViagem> findAll() {
        return em.createQuery("SELECT s FROM StatusViagem s ORDER BY s.id", StatusViagem.class)
                 .getResultList();
    }
}