package br.unioeste.backend.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.unioeste.backend.dto.CriarEmpregadoRequest;
import br.unioeste.backend.dto.EmpregadoResponse;
import br.unioeste.backend.service.EmpregadoService;
import br.unioeste.backend.dto.AlterarVinculoEmpregadoRequest;

@RestController
@RequestMapping("/api/empregados")
public class EmpregadoController {

    private final EmpregadoService service;

    public EmpregadoController(EmpregadoService service) {
        this.service = service;
    }

    @GetMapping
    public List<EmpregadoResponse> listar() {
        return service.listar();
    }

    @PostMapping
    public ResponseEntity<EmpregadoResponse> cadastrar(
        @Valid @RequestBody CriarEmpregadoRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(service.cadastrar(request));
    }
    @PutMapping("/{matricula}/vinculo")
public EmpregadoResponse alterarVinculo(
    @PathVariable String matricula,
    @Valid @RequestBody AlterarVinculoEmpregadoRequest request
) {
    return service.alterarVinculo(matricula, request);
}
}