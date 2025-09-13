# Configuração Mobile - Gratidão Diária

Este app está configurado para funcionar em dispositivos móveis usando Capacitor.

## Funcionalidades Mobile

### Envio de Cartas de Gratidão
- **No celular**: Use o botão "Compartilhar" para enviar via WhatsApp, email, SMS ou outros apps
- **Na web**: Use o botão "Enviar Carta" para abrir o cliente de email
- **Todas as plataformas**: Carta é sempre copiada automaticamente para área de transferência

## Para testar no dispositivo físico:

1. **Exporte para Github**: Clique no botão "Export to Github" no Lovable
2. **Clone o projeto**: `git clone seu-repositorio-url`
3. **Instale dependências**: `npm install`
4. **Adicione plataformas**:
   - Android: `npx cap add android`
   - iOS: `npx cap add ios`
5. **Build do projeto**: `npm run build`
6. **Sincronize**: `npx cap sync`
7. **Execute no dispositivo**:
   - Android: `npx cap run android`
   - iOS: `npx cap run ios` (requer Mac com Xcode)

## Requisitos
- **Android**: Android Studio instalado
- **iOS**: Mac com Xcode instalado

Para mais detalhes, consulte: https://lovable.dev/blogs/TODO