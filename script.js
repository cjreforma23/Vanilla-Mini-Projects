(() => {
  const display = document.getElementById('display');
  let current = '';

  function render() {
    display.textContent = current || '0';
  }

  function appendChar(ch) {
    if (ch === '.' && /\.$/.test(current.split(/\+|\-|\×|\÷|\*|\/|%/).pop())) return;
    current += ch;
    render();
  }

  function clearAll() { current = ''; render(); }
  function backspace() { current = current.slice(0, -1); render(); }

  function percent() {
    if (!current) return;
    try {
      const safe = toEval(current);
      const val = eval(safe);
      current = String(val / 100);
      render();
    } catch (e) { /* ignore */ }
  }

  function toEval(expr) {
    return expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  }

  function safeEvaluate() {
    if (!current) return;
    const sanitized = current.replace(/[^0-9.+\-*/()%]/g, '');
    try {
      const result = Function('return ' + toEval(sanitized))();
      current = String(result);
      render();
    } catch (e) {
      display.textContent = 'Error';
      setTimeout(() => render(), 800);
    }
  }

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.matches('[data-num]')) appendChar(t.getAttribute('data-num'));
    if (t.matches('[data-action]')) {
      const a = t.getAttribute('data-action');
      if (a === 'clear') clearAll();
      if (a === 'back') backspace();
      if (a === 'percent') percent();
      if (a === 'equals') safeEvaluate();
      if (a === 'op') appendChar(t.textContent.trim());
    }
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if ((/^[0-9]$/).test(e.key)) appendChar(e.key);
    if (e.key === '.') appendChar('.');
    if (e.key === 'Enter') { e.preventDefault(); safeEvaluate(); }
    if (e.key === 'Backspace') backspace();
    if (e.key === 'Escape') clearAll();
    if (['+','-','/','*','%'].includes(e.key)) appendChar(e.key);
  });

  render();
})();
