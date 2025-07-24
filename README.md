# AI WhatsApp Chatbot

Projeto NestJS para criar um chatbot integrado ao WhatsApp Business Cloud API e OpenAI GPT-4o.

## Configuração
1. Copie `.env.example` para `.env` e ajuste as variáveis.
2. Instale as dependências `npm install`.
3. Rode `npm run start:dev` para desenvolvimento ou `docker-compose up` para produção.

## Uso
- O webhook está em `/webhook`.
- Verifique a URL com o token configurado em `WHATSAPP_VERIFY_TOKEN`.

### Exemplo de chamada ao OpenAI
```ts
const history = [{ role: 'user', content: 'Olá' }];
const resposta = await openAiService.generateChatCompletion(history, { system: 'Você é simpático' });
```

### Envio de mensagem ao WhatsApp
```ts
await whatsappService.sendText('5511999999999', 'Olá mundo');
```

## Docker
`docker-compose up --build` inicia a aplicação e o Postgres.
