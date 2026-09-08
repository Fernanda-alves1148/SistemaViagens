export const viagensRascunho = [
    {
        id: 1,
        dataInicio: "2026-09-10",
        dataFim: "2026-09-12",
        origem: "Foz do Iguaçu - PR",
        destino: "Curitiba - PR",
        transportes: ["Avião"],
        motivo: "Reunião com clientes",
        status: "RASCUNHO",
        matricula: "1234-5",
        responsavel: "Ana Paula Dias",
        cargoSolicitacao: "COLABORADOR",
        areaSolicitacao: "INFORMATICA",

        historico: [
            {
                id: 1,
                data: "2026-09-05",
                responsavel: "Ana Paula Dias",
                status: "RASCUNHO",
                observacao:
                    "Viagem criada."
            }
        ],

        despesas: []
    },

    {
        id: 4,
        dataInicio: "2026-09-25",
        dataFim: "2026-09-27",
        origem: "Foz do Iguaçu - PR",
        destino: "São Paulo - SP",
        transportes: ["Avião"],
        motivo: "Visita técnica",
        status: "AJUSTES_SOLICITADOS",
        matricula: "5678-9",
        responsavel: "Carlos Oliveira",
        cargoSolicitacao: "COLABORADOR",
        areaSolicitacao: "INFORMATICA",

        observacaoAjustes:
            "Informe corretamente o período da viagem e detalhe o motivo da visita técnica.",

        historico: [
            {
                id: 1,
                data: "2026-09-01",
                responsavel: "Carlos Oliveira",
                status: "RASCUNHO",
                observacao:
                    "Viagem criada."
            },
            {
                id: 2,
                data: "2026-09-02",
                responsavel: "Carlos Oliveira",
                status: "SOLICITADA",
                observacao:
                    "Viagem enviada para análise."
            },
            {
                id: 3,
                data: "2026-09-03",
                responsavel: "Marcos Silva",
                status: "AJUSTES_SOLICITADOS",
                observacao:
                    "Informe corretamente o período e detalhe o motivo."
            }
        ],

        despesas: []
    }
];


export const viagensSolicitadas = [
    {
        id: 2,
        dataInicio: "2026-09-15",
        dataFim: "2026-09-17",
        origem: "Foz do Iguaçu - PR",
        destino: "Joinville - SC",
        transportes: ["Carro"],
        motivo: "Treinamento",

        status: "SOLICITADA",

        matricula: "2345-6",
        responsavel: "João Menezes",
        cargoSolicitacao: "COLABORADOR",
        areaSolicitacao: "INFORMATICA",

        historico: [
            {
                id: 1,
                data: "2026-09-04",
                responsavel: "João Menezes",
                status: "RASCUNHO",
                observacao:
                    "Viagem criada."
            },
            {
                id: 2,
                data: "2026-09-05",
                responsavel: "João Menezes",
                status: "SOLICITADA",
                observacao:
                    "Viagem enviada para análise."
            }
        ],

        despesas: []
    },

    {
        id: 3,
        dataInicio: "2026-09-20",
        dataFim: "2026-09-22",
        origem: "Foz do Iguaçu - PR",
        destino: "São Paulo - SP",
        transportes: ["Avião"],
        motivo: "Congresso",

        status: "APROVADA",

        matricula: "3456-7",
        responsavel: "Maria Silva",
        cargoSolicitacao: "COLABORADOR",
        areaSolicitacao: "RECURSOS HUMANOS",

        historico: [
            {
                id: 1,
                data: "2026-08-30",
                responsavel: "Maria Silva",
                status: "RASCUNHO",
                observacao:
                    "Viagem criada."
            },
            {
                id: 2,
                data: "2026-08-31",
                responsavel: "Maria Silva",
                status: "SOLICITADA",
                observacao:
                    "Viagem enviada para análise."
            },
            {
                id: 3,
                data: "2026-09-01",
                responsavel: "Marcos Silva",
                status: "APROVADA",
                observacao:
                    "Viagem aprovada."
            }
        ],

        despesas: [
            {
                id: 1,
                data: "2026-09-20",
                tipo: "Transporte",
                descricao: "Passagem aérea",
                valor: 850.00
            },
            {
                id: 2,
                data: "2026-09-20",
                tipo: "Hospedagem",
                descricao: "Hotel",
                valor: 420.00
            }
        ]
    },

    {
        id: 5,
        dataInicio: "2026-09-01",
        dataFim: "2026-09-03",
        origem: "Foz do Iguaçu - PR",
        destino: "Curitiba - PR",
        transportes: ["Ônibus"],
        motivo: "Reunião administrativa",

        status: "REJEITADA",

        matricula: "4567-8",
        responsavel: "Fernanda Souza",
        cargoSolicitacao: "GESTOR",
        areaSolicitacao: "ADMINISTRATIVO",

        justificativa:
            "O período informado coincide com outro compromisso corporativo.",

        historico: [
            {
                id: 1,
                data: "2026-08-25",
                responsavel: "Fernanda Souza",
                status: "RASCUNHO",
                observacao:
                    "Viagem criada."
            },
            {
                id: 2,
                data: "2026-08-26",
                responsavel: "Fernanda Souza",
                status: "SOLICITADA",
                observacao:
                    "Viagem enviada para análise."
            },
            {
                id: 3,
                data: "2026-08-27",
                responsavel: "Marcos Silva",
                status: "REJEITADA",
                observacao:
                    "O período informado coincide com outro compromisso corporativo."
            }
        ],

        despesas: []
    },

    {
        id: 6,
        dataInicio: "2026-09-05",
        dataFim: "2026-09-06",
        origem: "Foz do Iguaçu - PR",
        destino: "Guarulhos - SP",
        transportes: ["Carro"],
        motivo: "Visita técnica",

        status: "CANCELADA",

        matricula: "6789-0",
        responsavel: "Pedro Santos",
        cargoSolicitacao: "COLABORADOR",
        areaSolicitacao: "INFORMATICA",

        historico: [
            {
                id: 1,
                data: "2026-08-28",
                responsavel: "Pedro Santos",
                status: "RASCUNHO",
                observacao:
                    "Viagem criada."
            },
            {
                id: 2,
                data: "2026-08-29",
                responsavel: "Pedro Santos",
                status: "CANCELADA",
                observacao:
                    "Viagem cancelada pelo solicitante."
            }
        ],

        despesas: []
    }
];