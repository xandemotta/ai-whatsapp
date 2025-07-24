# Documentação do Projeto

Este documento descreve cada arquivo presente no repositório **ai-whatsapp** e seu papel dentro do projeto. O objetivo é fornecer uma visão geral do código e facilitar o entendimento da aplicação.

## Estrutura de Pastas

```
/ (raiz)
├── Dockerfile
├── README.md
├── docker-compose.yml
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── openai/
│   │   │   ├── openai.module.ts
│   │   │   └── openai.service.ts
│   │   ├── tenants/
│   │   │   ├── entities/
│   │   │   │   ├── tenant.entity.ts
│   │   │   │   └── message.entity.ts
│   │   │   ├── tenant.middleware.ts
│   │   │   ├── tenants.module.ts
│   │   │   ├── tenants.service.ts
│   │   │   └── index.ts
│   │   └── whatsapp/
│   │       ├── verify.middleware.ts
│   │       ├── whatsapp.controller.ts
│   │       ├── whatsapp.module.ts
│   │       └── whatsapp.service.ts
│   └── utils/
│       ├── encryptor.ts
│       ├── logger.ts
│       └── rate-limit.middleware.ts
└── dist/ (gerado após build)
```

A seguir, cada arquivo e diretório é descrito em detalhes.

## Arquivos de Configuração e Utilidades na Raiz

- **Dockerfile**: Define a imagem Docker utilizada para produção. Copia os arquivos do projeto, instala as dependências e executa a aplicação compilada (`dist/main.js`).
- **docker-compose.yml**: Facilita a inicialização do ambiente com Docker, incluindo a aplicação e um banco de dados PostgreSQL.
- **README.md**: Orientações rápidas sobre como configurar e executar o projeto em desenvolvimento ou produção.
- **package.json**: Declara dependências, scripts npm e metadados do projeto. Os principais scripts são `build`, `start`, `start:dev` e `test`.
- **package-lock.json**: Arquivo gerado automaticamente que garante o versionamento exato das dependências instaladas.
- **tsconfig.json**: Configurações do TypeScript para compilar o código na pasta `src` para a pasta `dist`.
- **.env.example**: Modelo de arquivo de variáveis de ambiente com todas as configurações necessárias (tokens, credenciais, etc.).

## Arquivos Principais em `src`

### `main.ts`
Inicializa a aplicação NestJS. Configura HTTPS utilizando certificados locais, instancia `AppModule` e inicia o servidor escutando na porta definida em `PORT`.

### `app.module.ts`
Módulo raiz da aplicação. Carrega variáveis de ambiente (`ConfigModule`), configura a conexão com o PostgreSQL (`TypeOrmModule`) e importa os módulos principais: `WhatsappModule`, `AuthModule`, `OpenAiModule` e `TenantsModule`.

## Módulo `auth`
- **auth.module.ts**: Registra o `JwtModule` com segredo definido nas variáveis de ambiente e expõe a estratégia de autenticação JWT.
- **jwt-auth.guard.ts**: Guardião que utiliza a estratégia JWT para proteger rotas.
- **jwt.strategy.ts**: Define como o token JWT é extraído e validado, anexando informações do tenant ao request.

## Módulo `openai`
- **openai.module.ts**: Exporta `OpenAiService` para que outros módulos possam utilizá-lo.
- **openai.service.ts**: Encapsula chamadas à API da OpenAI. Possui métodos para gerar respostas de chat (`generateChatCompletion`) e transcrever áudio (`transcribeAudio`).

## Módulo `tenants`
- **tenants.module.ts**: Registra as entidades `Tenant` e `Message` no TypeORM e disponibiliza `TenantsService`.
- **tenants.service.ts**: Acesso ao banco de dados para operações relacionadas a tenants e histórico de mensagens.
- **tenant.middleware.ts**: Middleware que injeta o `tenantId` na requisição, obtendo-o do token JWT ou do header `x-tenant-id`.
- **entities/tenant.entity.ts**: Entidade que representa um tenant (cliente) com `id`, `name` e `systemPrompt` (mensagem de sistema para o ChatGPT).
- **entities/message.entity.ts**: Entidade de histórico de mensagens associada a um tenant.
- **index.ts**: Reexporta as classes do módulo para facilitar importações.

## Módulo `whatsapp`
- **whatsapp.module.ts**: Configura o controlador, serviço e middleware de verificação de requisições recebidas do WhatsApp.
- **whatsapp.controller.ts**: Endpoint `/webhook` para receber e processar mensagens. Faz verificação do token, lê mensagens recebidas, consulta o histórico do tenant, envia a conversa para o OpenAI e responde via WhatsApp.
- **whatsapp.service.ts**: Responsável por enviar mensagens de texto para a API do WhatsApp Business.
- **verify.middleware.ts**: Garante que as requisições ao webhook são legítimas, verificando a assinatura `x-hub-signature-256`.

## Utilitários em `src/utils`
- **encryptor.ts**: Classe para criptografia e descriptografia simétrica usando AES-256-CBC.
- **logger.ts**: Implementação de logger customizado baseado em Winston, com rotação diária de arquivos.
- **rate-limit.middleware.ts**: Middleware de rate limit em memória, limitando o número de requisições por IP.

## Pasta `dist`
Gerada após o comando `npm run build`. Contém o JavaScript compilado a partir dos arquivos TypeScript de `src` e não deve ser editada manualmente.

## Visão Geral do Fluxo da Aplicação
1. A aplicação inicia em `main.ts`, carregando `AppModule`.
2. `AppModule` configura banco de dados, variáveis de ambiente e módulos.
3. Quando o WhatsApp envia uma mensagem para o webhook, `whatsapp.controller.ts` processa a requisição. O middleware `verify.middleware.ts` garante a autenticidade da chamada e `TenantMiddleware` associa a requisição a um tenant.
4. O texto recebido é adicionado ao histórico do tenant (`TenantsService`). Esse histórico é enviado ao `OpenAiService`, que retorna uma resposta do GPT.
5. A resposta é armazenada no banco de dados e enviada de volta ao usuário pelo `WhatsappService`.

Este documento resume todos os arquivos do projeto e descreve como eles interagem para criar um chatbot no WhatsApp integrado ao OpenAI GPT.
