# Documentação do Projeto AI WhatsApp

Este documento descreve a finalidade geral do projeto e apresenta um resumo de cada arquivo fonte.

## Visão Geral

O projeto implementa um chatbot em NestJS integrado ao WhatsApp Business Cloud API e ao OpenAI para geração de respostas automáticas. Também há suporte a múltiplos tenants, possibilitando diferentes configurações de prompt.

## Estrutura de Pastas

- **src/**: Código fonte principal escrito em TypeScript.
- **modules/**: Módulos do NestJS organizados por funcionalidade.
- **utils/**: Funções e classes utilitárias usadas em toda a aplicação.

## Descrição dos Arquivos

### src/app.module.ts
Módulo principal que registra configurações, conexão com banco de dados e módulos de funcionalidades.

### src/main.ts
Ponto de entrada da aplicação. Inicializa o servidor HTTPS e inicia a escuta na porta definida.

### src/modules/auth/
- **auth.module.ts**: Define as dependências de autenticação via JWT.
- **jwt-auth.guard.ts**: Guard que verifica o token JWT das requisições.
- **jwt.strategy.ts**: Estratégia Passport para validar e extrair informações do token.

### src/modules/openai/
- **openai.module.ts**: Disponibiliza o serviço de integração com o OpenAI.
- **openai.service.ts**: Encapsula chamadas à API da OpenAI para chat e transcrições.

### src/modules/tenants/
- **tenants.module.ts**: Gerencia tenants e mensagens no banco.
- **tenants.service.ts**: Operações de busca de tenant e histórico de conversa.
- **tenant.middleware.ts**: Resolve e injeta o tenant na requisição.
- **entities/tenant.entity.ts**: Entidade TypeORM do tenant.
- **entities/message.entity.ts**: Entidade TypeORM de mensagem.
- **index.ts**: Reexporta itens do módulo para facilitar imports.

### src/modules/whatsapp/
- **whatsapp.module.ts**: Registra controller, serviço e middleware de verificação.
- **whatsapp.controller.ts**: Webhook para mensagens e verificações do WhatsApp.
- **whatsapp.service.ts**: Envio de mensagens pela API do WhatsApp.
- **verify.middleware.ts**: Valida a assinatura das requisições do Webhook.

### src/utils/
- **logger.ts**: Implementa serviço de logging usando Winston.
- **encryptor.ts**: Classe de criptografia simétrica AES.
- **rate-limit.middleware.ts**: Middleware de limite de requisições.

## Como Utilizar

Consulte o `README.md` para instruções detalhadas de instalação e execução.
