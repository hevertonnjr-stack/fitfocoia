# Integração RisePay - Guia de Configuração

## 📋 Visão Geral

Este documento explica como integrar o RisePay ao seu sistema de pagamentos do FitPro.

## 🔑 Passo 1: Obter Credenciais RisePay

1. Acesse [RisePay Dashboard](https://risepay.com.br)
2. Faça login na sua conta
3. Navegue até **Configurações** → **API**
4. Copie suas credenciais:
   - **Client ID**
   - **Client Secret**

## 🛠️ Passo 2: Configurar Credenciais no Sistema

As credenciais devem ser armazenadas de forma segura como secrets do Lovable Cloud:

### Opção 1: Via Chat com IA
Peça ao assistente para adicionar os secrets:
```
"Adicione os secrets RISEPAY_CLIENT_ID e RISEPAY_CLIENT_SECRET"
```

### Opção 2: Manual
1. Acesse Settings → Secrets
2. Adicione os seguintes secrets:
   - `RISEPAY_CLIENT_ID`: Seu Client ID
   - `RISEPAY_CLIENT_SECRET`: Seu Client Secret

## 📝 Passo 3: Criar Edge Function de Pagamento

Você precisará criar uma edge function que:

1. **Recebe dados do checkout**:
   ```typescript
   {
     plan_type: 'mensal' | 'trimestral' | 'anual',
     customer_email: string,
     customer_name: string
   }
   ```

2. **Processa o pagamento via RisePay API**:
   - Cria transação no RisePay
   - Retorna link de pagamento ou processa cartão

3. **Após pagamento confirmado** (webhook):
   - Cria usuário no sistema
   - Gera credenciais de acesso
   - Cria assinatura no banco
   - Envia email com credenciais

## 🔄 Passo 4: Configurar Webhooks

No painel RisePay, configure o webhook para:
```
https://seu-projeto.lovableproject.com/functions/v1/risepay-webhook
```

Eventos a monitorar:
- `payment.approved`
- `payment.refused`
- `subscription.canceled`

## 📧 Passo 5: Email de Confirmação

Após pagamento confirmado, o sistema deve:
1. Criar credenciais únicas para o cliente
2. Enviar email com:
   - Login
   - Senha temporária
   - Link de acesso
   - Detalhes do plano

## 🧪 Teste a Integração

1. Use o ambiente de sandbox do RisePay
2. Teste com valores pequenos primeiro
3. Verifique se:
   - Pagamento é processado
   - Webhook é recebido
   - Usuário é criado
   - Email é enviado

## 🔒 Segurança

- ✅ Nunca exponha suas credenciais no frontend
- ✅ Sempre use HTTPS
- ✅ Valide webhooks com assinatura
- ✅ Use ambiente sandbox para testes

## 📚 Documentação Adicional

- [RisePay API Docs](https://risepay.com.br/docs)
- [Lovable Cloud Functions](https://docs.lovable.dev)

## 🆘 Precisa de Ajuda?

Peça ao assistente IA:
- "Criar edge function para processar pagamento RisePay"
- "Configurar webhook RisePay"
- "Adicionar envio de email após pagamento"
