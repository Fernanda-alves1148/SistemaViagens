package br.unioeste.backend.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.unioeste.backend.dto.CriarViagemRequest;
import br.unioeste.backend.dto.ViagemResponse;
import br.unioeste.backend.service.ViagemService;

@RestController
@RequestMapping("/api/viagens")
public class ViagemController {

    private final ViagemService viagemService;

    public ViagemController(ViagemService viagemService) {
        this.viagemService = viagemService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ViagemResponse cadastrar(
        @Valid @RequestBody CriarViagemRequest request
    ) {
        return viagemService.cadastrar(request);
    }

    @GetMapping
    public List<ViagemResponse> listar() {
        return viagemService.listar();
    }
}