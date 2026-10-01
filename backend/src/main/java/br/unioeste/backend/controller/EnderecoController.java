package br.unioeste.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unioeste.backend.dto.EnderecoResponse;
import br.unioeste.backend.service.EnderecoService;

@RestController
@RequestMapping("/api/enderecos")
public class EnderecoController {

    private final EnderecoService service;

    public EnderecoController(EnderecoService service) {
        this.service = service;
    }

    @GetMapping
    public List<EnderecoResponse> listar() {
        return service.listar();
    }
}