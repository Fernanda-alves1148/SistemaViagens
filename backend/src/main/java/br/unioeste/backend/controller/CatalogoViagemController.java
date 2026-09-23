package br.unioeste.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unioeste.backend.dto.CidadeResponse;
import br.unioeste.backend.dto.OpcaoResponse;
import br.unioeste.backend.service.CatalogoViagemService;

@RestController
@RequestMapping("/api")
public class CatalogoViagemController {

    private final CatalogoViagemService catalogoService;

    public CatalogoViagemController(
        CatalogoViagemService catalogoService
    ) {
        this.catalogoService = catalogoService;
    }

    @GetMapping("/cidades")
    public ResponseEntity<List<CidadeResponse>> listarCidades() {
        return ResponseEntity.ok(
            catalogoService.listarCidades()
        );
    }

    @GetMapping("/motivos")
    public ResponseEntity<List<OpcaoResponse>> listarMotivos() {
        return ResponseEntity.ok(
            catalogoService.listarMotivos()
        );
    }

    @GetMapping("/meios-transporte")
    public ResponseEntity<List<OpcaoResponse>> listarMeiosTransporte() {
        return ResponseEntity.ok(
            catalogoService.listarMeiosTransporte()
        );
    }
}