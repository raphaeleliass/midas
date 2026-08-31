# Landing: direcionamento de autenticação

## Objetivo

Fazer com que os CTAs da landing selecionem diretamente o formulário de autenticação solicitado: login para **Entrar** e cadastro para **Cadastrar**.

## Rotas e fluxo

- `/login?mode=signin` mostra o formulário `SignInForm`.
- `/login?mode=signup` mostra o formulário `SignUpForm`.
- `/login` continua compatível e abre o cadastro (`signup`), igual ao comportamento atual.
- Os controles internos que alternam entre os formulários atualizam a URL para preservar o modo em recargas e links compartilhados.

## Superfície alterada

- Botão **Entrar** da navegação da landing.
- Botões **Cadastrar** da navegação, hero e fechamento da landing.
- Página de autenticação, somente para interpretar e refletir `mode`.

## Tratamento de erros

Um valor ausente ou inválido de `mode` usa `signup`; nenhum erro novo é mostrado ao usuário.

## Verificação

- Abrir cada CTA e confirmar o formulário inicial correto.
- Confirmar que a alternância entre formulários continua funcionando.
- Executar a checagem de tipos do app web.
