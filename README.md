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

Use localhost ou HTTPS para testar a câmera. O app abre com preferência pela câmera traseira. A prévia e a exportação usam corte central 3:4 e a mesma moldura SVG. A selfie é espelhada. A exportação PNG usa os pixels disponíveis nesse recorte, com limite de 3072 × 4096 para limitar o consumo de memória. A seleção de apps depende do menu de compartilhamento do sistema. Sem suporte ao compartilhamento de arquivos, o app baixa o PNG.

## Direção de arte

O convite tem céu ciano (~#53C5F1), rosa intenso (~#F7197E), amarelo-ouro (~#FFD421), verde-lima (~#9CDF31), creme (~#FFF2D0) e lilás (~#AB8CF2). A composição é vertical, com um painel claro central e objetos de plataforma nas margens. Blocos dourados emolduram a data e a hora. O castelo tem paredes de creme, torres com telhados rosas e bandeiras. A princesa usa vestido rosa, coroa dourada com joia rosa e uma varinha de estrela, emergindo de um cano verde. As formas têm contornos marcados, brilhos e sombras suaves. A referência tem acabamento digital 2D com sombreamento suave. As letras são pesadas, angulares nos títulos e arredondadas na faixa de abertura.

As molduras transferem a ornamentação para os cantos, mantendo a região central livre para pessoas e grupos. A coroa e o letreiro dourado conectam o site e o cartão. O Jardim usa rosa, lilás e creme com lírios vetoriais. O tema da fase aparece em moedas, plataformas, blocos, cogumelos e na bandeira de chegada.

## Galeria privada

O app processa fotos localmente e o upload está desativado. O repositório não contém configuração Firebase. Para ativar a galeria, é necessário confirmar o ID e o bucket do projeto Aniversario-Lis-2026, obter acesso autorizado de configuração, habilitar Firebase Auth e identificar a conta da organizadora. Antes de aceitar fotos reais, implementar consentimento, validação no servidor, limites de tamanho e frequência, armazenamento sem URLs públicas e autorização administrativa para listar, baixar e excluir. Manter credenciais administrativas no ambiente do servidor. Validar a separação entre convidados e administradora antes de habilitar o envio.
