package br.unioeste.backend.repository.impl;

import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Repository;

import br.unioeste.backend.entity.Usuario;
import br.unioeste.backend.repository.UsuarioRepository;

@Repository
public class UsuarioRepositoryImpl implements UsuarioRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Optional<Usuario> findById(Integer id) {
        Usuario usuario = em.find(Usuario.class, id);
        return Optional.ofNullable(usuario);
    }
@Override
public boolean isGestorAtual(Integer idUsuario) {

    Number quantidade = (Number) em
        .createNativeQuery("""
            SELECT COUNT(*)
            FROM usuario u
            JOIN historico_empregado h
              ON h.matricula = u.matricula
            JOIN cargo c
              ON c.id_cargo = h.id_cargo
            WHERE u.id_usuario = :idUsuario
              AND h.data_fim IS NULL
              AND UPPER(c.nome) = 'GESTOR'
            """)
        .setParameter("idUsuario", idUsuario)
        .getSingleResult();

    return quantidade.intValue() > 0;
}
}