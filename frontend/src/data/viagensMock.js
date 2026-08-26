export const viagensRascunho = [
    {
        id: 1,
        dataInicio: "2026-09-10",
        dataFim: "2026-09-15",
        origem: "São Paulo - SP",
        destino: "Curitiba - PR",
        transportes: ["Avião"],
        status: "EM_RASCUNHO",

        despesas: [
            {
                id: 1,
                tipo: "Hotel",
                valor: 850
            },
            {
                id: 2,
                tipo: "Alimentação",
                valor: 300
            }
        ],

        motivo: "Participação em reunião com clientes."
    },

    {
        id: 2,
        dataInicio: "2026-09-20",
        dataFim: "2026-09-22",
        origem: "São Paulo - SP",
        destino: "Rio de Janeiro - RJ",
        transportes: ["Carro"],
        status: "EM_RASCUNHO",

        despesas: [
            {
                id: 1,
                tipo: "Combustível",
                valor: 250
            }
        ],

        motivo: "Visita técnica."
    }
];

export const viagensSolicitadas = [
    {
        id: 3,
        dataInicio: "2026-08-05",
        dataFim: "2026-08-08",
        origem: "São Paulo - SP",
        destino: "Brasília - DF",
        transportes: ["Avião"],
        status: "EM_ANALISE"
    },

    {
        id: 4,
        dataInicio: "2026-07-01",
        dataFim: "2026-07-04",
        origem: "São Paulo - SP",
        destino: "Belo Horizonte - MG",
        transportes: ["Ônibus"],
        status: "ACEITA"
    },

    {
        id: 5,
        dataInicio: "2026-07-12",
        dataFim: "2026-07-14",
        origem: "São Paulo - SP",
        destino: "Salvador - BA",
        transportes: ["Avião"],
        status: "REJEITADA",
        justificativa:
            "O período informado não está disponível para esse tipo de solicitação."
    }
];