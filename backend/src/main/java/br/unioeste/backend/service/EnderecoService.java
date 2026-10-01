package br.unioeste.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.unioeste.backend.dto.EnderecoResponse;
import br.unioeste.backend.repository.EnderecoRepository;

@Service
public class EnderecoService {

    private final EnderecoRepository repository;

    public EnderecoService(EnderecoRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<EnderecoResponse> listar() {
        return repository.findAll()
            .stream()
            .map(EnderecoResponse::de)
            .toList();
    }
}