
# Guia de Deploy - House Key Flow

## Deploy no Netlify

### Configurações Necessárias

#### 1. Variáveis de Ambiente
No painel do Netlify, configure as seguintes variáveis de ambiente:

```
VITE_API_URL=https://sua-api-url.com
```

Se você não tiver uma API configurada, pode deixar esta variável vazia. A aplicação funcionará em modo offline.

#### 2. Configurações de Build
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

#### 3. Arquivos de Configuração
Os seguintes arquivos já estão configurados no projeto:

- `public/_redirects`: Configuração para SPAs (Single Page Applications)
- `netlify.toml`: Configurações específicas do Netlify

### Troubleshooting

#### Tela em Branco
Se a aplicação mostrar uma tela em branco:

1. **Verifique o console do navegador** (F12 > Console)
2. **Verifique as variáveis de ambiente** no painel do Netlify
3. **Verifique os logs de build** no painel do Netlify

#### Erros Comuns

**Erro 404 em rotas**
- Verificar se o arquivo `public/_redirects` existe
- Verificar se a configuração de redirects está correta

**Erro de conexão com API**
- Verificar se `VITE_API_URL` está configurado corretamente
- A aplicação funcionará sem API, mas com funcionalidade limitada

**Erro de build**
- Verificar se todas as dependências estão instaladas
- Verificar se não há erros de TypeScript
- Verificar se os imports estão corretos

### Modo de Desenvolvimento vs Produção

**Desenvolvimento:**
- API URL pode não estar configurada
- Logs detalhados no console
- Hot reload ativo

**Produção:**
- Logs reduzidos
- Otimizações de build aplicadas
- Funciona offline se API não estiver disponível

### Suporte

Se encontrar problemas durante o deploy:
1. Verifique os logs de build no Netlify
2. Verifique o console do navegador
3. Verifique se todas as variáveis de ambiente estão configuradas
