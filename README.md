# 👑 Reino da Princesa Lis

Site de fotos da festa de 1 aninho da Lis (28/11/2026).

## Objetivo

Convidados acessam pelo QR Code, tiram ou enviam uma foto, escolhem entre cinco molduras temáticas delicadas, ajustam a imagem, salvam no álbum privado e podem baixar ou compartilhar pelo WhatsApp e Instagram (compartilhamento nativo quando disponível).

A galeria completa é **exclusiva da organizadora**; convidados não podem navegar pelas fotos de outras pessoas.

## Arquitetura prevista

- Next.js + TypeScript, interface mobile-first
- Firebase Authentication para o painel administrativo
- Firebase Storage e Firestore com regras restritivas para imagens e metadados
- Vercel para hospedar a aplicação

**Importante:** não colocar fotos reais, credenciais ou chaves privadas no GitHub. O repositório está público no momento; alterar a visibilidade para privado antes de incluir materiais pessoais.

## Estado

Planejamento e implementação inicial. Ainda não está publicado nem integrado ao Firebase. Não imprimir QR Code antes de validar o endereço definitivo e os testes de privacidade.
