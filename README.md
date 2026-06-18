# Let Me Do It — Sistema de Correção Automatizada de Provas

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue%203-4FC08D?logo=vuedotjs&logoColor=fff)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=fff)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=fff)](https://redis.io/)
[![Google Gemini](https://img.shields.io/badge/Gemini-8E75B2?logo=googlegemini&logoColor=fff)](https://ai.google.dev/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=fff)](https://expressjs.com/)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](/)

**Let Me Do It** é uma plataforma web full-stack que automatiza a correção de provas e gabaritos usando Inteligência Artificial. O professor tira uma foto da prova, e o sistema — utilizando Google Gemini — extrai as respostas, calcula a nota e organiza tudo por turma e exame.

Este repositório contém o **frontend** da aplicação. O backend (API, filas, IA) foi desenvolvido separadamente e comunica-se com esta interface via REST.

---

## Objetivo do Projeto

Otimizar o tempo de docentes através da automação de processos repetitivos, utilizando Inteligência Artificial e processamento assíncrono.

## O Problema que Resolvemos

A correção manual de gabaritos (testes de múltipla escolha) é um dos processos mais exaustivos e suscetíveis a erros na rotina de um professor.

**Os principais desafios atacados são:**

1. **Desperdício de Tempo:** Professores gastam horas conferindo gabarito por gabarito.
2. **Erro Humano:** A fadiga leva a erros de contagem ou interpretação das marcações dos alunos.
3. **Escalabilidade:** Corrigir provas para centenas de alunos de uma só vez é um gargalo operacional.
4. **Falta de Centralização:** Dificuldade em manter um histórico organizado de notas por turma e exame.

---

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 📸 **Correção por foto** | Tire foto do gabarito e a IA extrai e corrige automaticamente |
| 📊 **Gestão de turmas** | Crie, edite e gerencie turmas com alunos |
| 📝 **Criação de exames** | Defina gabaritos oficiais por exame |
| 📈 **Histórico de notas** | Visualize notas, acertos e estatísticas por turma |
| 🔐 **Autenticação** | Login com e-mail/senha ou Google OAuth |
| 🔄 **Processamento assíncrono** | A correção roda em background — você não precisa esperar |
| 📱 **Responsivo** | Interface adaptada para mobile e desktop |

---

## Tecnologias Utilizadas

### Frontend
- **Vue 3** — Framework progressivo para construção da interface
- **TypeScript** — Tipagem estática para maior segurança e produtividade
- **Vite** — Build tool rápida para desenvolvimento
- **Tailwind CSS & PrimeVue** — Estilização utilitária e componentes de UI
- **Vue Router** — Roteamento SPA
- **Pinia** — Gerenciamento de estado global
- **TanStack Query** — Gerenciamento de cache e requisições assíncronas
- **Axios** — Cliente HTTP
- **vue3-google-login** — Autenticação Google OAuth no frontend

### Infraestrutura (Backend)
- **Node.js & Express** — API REST
- **MongoDB & Mongoose** — Banco de dados NoSQL
- **Redis & BullMQ** — Filas assíncronas para processamento de IA
- **Google Gemini AI** — OCR e análise semântica das imagens
- **Cloudinary** — Armazenamento e transformação de imagens
- **JWT & Bcrypt** — Autenticação segura
- **Docker Compose** — Orquestração de contêineres (app + MongoDB + Redis)

---

## Arquitetura e Fluxo de Dados

O sistema foi projetado com conceitos de engenharia para garantir robustez e escalabilidade:

- **Arquitetura Modular:** O frontend organiza-se em páginas, componentes e serviços que espelham os módulos do backend (Classes, Exams, Submissions, Users).
- **Processamento Assíncrono:** Ao enviar fotos das provas, o usuário não precisa esperar a resposta da IA. O trabalho é delegado para uma fila (Redis + BullMQ), processado em background e o status é atualizado via polling.

  ```
  📱 Frontend → 📸 Upload da foto → 🔄 API → 📥 Fila Redis
      ↓                                                     ↓
  📊 Status atualizado ← 💾 Banco ← 🤖 Google Gemini ← 🎯 Worker
  ```

- **Pipeline de Imagem:** Antes de enviar as imagens para a IA, filtros de contraste e escala de cinza são aplicados via Cloudinary, aumentando a precisão do OCR.
- **Segurança:** Autenticação JWT com refresh tokens armazenados em cookies httpOnly, rate limiting e validação rigorosa de dados com Zod.

---

## Como Rodar o Projeto

### Pré-requisitos

- Node.js 20+ ou 22+
- npm

### Passos

```bash
# Clone o repositório
git clone https://github.com/gabrii3lmao/lmdi-frontend.git
cd lmdi-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente (veja .env.example)
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Build para produção

```bash
npm run build
npm run preview
```

---

## Testes

```bash
# Executar todos os testes
npm test
```

---

## Licença

Todos os direitos reservados. Este software é disponibilizado publicamente apenas para visualização. Não é permitido copiar, modificar, distribuir ou utilizar o código sem autorização explícita do autor. Veja o arquivo `LICENSE` para mais informações.

---

## Autor

Desenvolvido por **Gabriel Luz** como projeto de estudo e aplicação prática para a disciplina de Projeto Integrador.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=fff)](www.linkedin.com/in/gabrielmluz)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=fff)](https://github.com/gabrii3lmao)

---

> ⚠️ **Nota:** O backend deste projeto é mantido em repositório privado para preservar chaves de API e configurações de infraestrutura. Este frontend é a vitrine pública do sistema.
