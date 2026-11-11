# O Reino da Princesa Lis

Câmera do primeiro aniversário da Lis, em 28 de novembro de 2026. A página solicita acesso à câmera ao abrir e oferece importação da galeria e captura pelo aplicativo de câmera do celular.

## Desenvolvimento

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

Use localhost ou HTTPS para testar a câmera. O app abre com preferência pela câmera traseira. A prévia e a exportação usam corte central 3:4 e o mesmo PNG transparente. A selfie é espelhada. A exportação PNG usa os pixels disponíveis nesse recorte, com limite de 3072 × 4096 para limitar o consumo de memória. A seleção de apps depende do menu de compartilhamento do sistema. Sem suporte ao compartilhamento de arquivos, o app baixa o PNG.

## Direção de arte

O convite organiza castelo, bandeiras, cogumelos e moedas em torno de uma área central clara. A câmera usa a mesma lógica. O creme do papel (#fcf2e8), o branco quente (#fffaf3), o rosa antigo (#9c4969) e o dourado fosco (#d9b789) sustentam a interface. O lilás, o verde sálvia e o azul pálido entram nas ilustrações. A coroa com joia rosa acompanha a assinatura em serifada, com DM Sans nos controles e no subtítulo.

As cinco molduras foram fornecidas em Molduras_Lis_Site.zip e seguem a ordem dos arquivos, de Lis Clássica a Chegada ao Castelo. Depois delas, o seletor oferece Lis Letreiro e Lis Essencial. A câmera e a exportação usam o mesmo PNG 3:4 de cada moldura. As miniaturas WebP são derivadas dos PNGs. O cartão de permissão só aparece após uma falha e pode ser fechado.

As ilustrações partiram de um atlas original criado com ImageGen a partir do convite como referência. O prompt pediu 12 peças isoladas em fundo transparente, com aquarela e guache sobre papel, granulação suave e contornos terrosos. As peças foram coroa com joia rosa, castelo com torres e bandeiras, cogumelos rosa e lilás, moeda, bloco de interrogação, plataforma, lírios, bandeira de chegada, estrela sorridente, nuvens, cano verde e faixa rosa com friso dourado.

## Galeria privada

O app processa fotos localmente e o upload está desativado. O repositório não contém configuração Firebase. Para ativar a galeria, é necessário confirmar o ID e o bucket do projeto Aniversario-Lis-2026, obter acesso autorizado de configuração, habilitar Firebase Auth e identificar a conta da organizadora. Antes de aceitar fotos reais, implementar consentimento, validação no servidor, limites de tamanho e frequência, armazenamento sem URLs públicas e autorização administrativa para listar, baixar e excluir. Manter credenciais administrativas no ambiente do servidor. Validar a separação entre convidados e administradora antes de habilitar o envio.
