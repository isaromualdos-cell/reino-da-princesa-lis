# O Reino da Princesa Lis

Site do primeiro aniversário da Lis, em 28 de novembro de 2026, com confirmação de presença e câmera com molduras no dia da festa.

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

## Álbum privado da festa

Cada foto finalizada com moldura é enviada para a pasta `aniversario-lis/` do armazenamento privado Vercel Blob. A organizadora acessa os arquivos pelo painel Storage do projeto. O site dos convidados permite enviar, baixar a própria foto e compartilhar, sem listar o conteúdo do álbum.

O armazenamento deve estar conectado ao projeto com `BLOB_READ_WRITE_TOKEN`. O envio usa JPEG de até 4 MB, com resolução de até 1620 × 2160. O download continua sendo o PNG produzido pela câmera. Cada captura tem um identificador único, preservado ao tentar novamente um envio.

A interface informa sobre o envio antes da captura e mostra se o álbum recebeu a foto. Em caso de falha, a pessoa pode repetir o envio ou baixar a própria cópia.

## Confirmação de presença

- `/`: formulário público. Cada família escreve os nomes das pessoas que vão, ou registra que não vai.
- `/presencas`: painel privado, com senha configurada em `LIS_ADMIN_PASSWORD`. Use uma senha aleatória forte. Configure `LIS_RSVP_MODE=live` somente em produção. As respostas ficam no armazenamento privado de Blob, sob o prefixo `confirmacoes-lis/` em produção e `teste-confirmacoes-lis/` nos outros ambientes.
- `/fotos`: câmera. A câmera e o envio são liberados a partir de 28/11/2026 às 16h de São Paulo.
