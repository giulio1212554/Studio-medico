export function renderErrorPage() {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Errore – Studio Aurelia</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8faf9; color: #1e293b; }
    .box { text-align: center; padding: 2rem; }
    a { color: #2a6e78; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Qualcosa è andato storto</h1>
    <p>Riprova più tardi o torna alla <a href="/">home</a>.</p>
  </div>
</body>
</html>`;
}
