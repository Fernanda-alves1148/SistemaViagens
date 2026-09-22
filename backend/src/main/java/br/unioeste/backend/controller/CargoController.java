package br.unioeste.backend.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.unioeste.backend.dto.CadastroNomeRequest;
import br.unioeste.backend.dto.CadastroNomeResponse;
import br.unioeste.backend.service.CargoService;

@RestController
@RequestMapping("/api/cargos")
public class CargoController {

    private final CargoService service;

    public CargoController(CargoService service) {
        this.service = service;
    }

    @GetMapping
    public List<CadastroNomeResponse> listar() {
        return service.listar();
    }

    @PostMapping
    public ResponseEntity<CadastroNomeResponse> cadastrar(
        @Valid @RequestBody CadastroNomeRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(service.cadastrar(request));
    }
}