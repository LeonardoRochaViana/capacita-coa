# Projeto Capacita COA

Portal interno de Capacitação Operacional e Desenvolvimento das Mesas do COA.

Uma plataforma para centralizar aulas operacionais, ITs, fluxogramas, DDDs,
checklists, simulados e indicadores de capacitação das mesas do COA.

## Executar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js (App Router), TypeScript e Tailwind CSS
- Base local provisória com persistência temporária no navegador
- Versão inicial sem banco de dados ou APIs externas

## Arquitetura futura

A separação entre tipos, fontes locais, componentes e telas facilita a evolução
para SharePoint Lists, Biblioteca de Documentos, Power Apps e Power Automate.
