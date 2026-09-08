package br.unioeste.backend.repository;

import java.util.Optional;

import br.unioeste.backend.entity.Usuario;

public interface UsuarioRepository {
    Optional<Usuario> findById(Integer id);
}