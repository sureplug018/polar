/**
 * Show a custom alert
 * @param {'success'|'error'|'warning'} type
 * @param {string} title
 * @param {string} [message] - optional
 */
function showAlert(type, title, message) {
  const container = document.getElementById('alert');
  if (!container) {
    console.error('Element with id="alert" not found');
    return;
  }

  // Clear previous alert
  container.innerHTML = '';

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert ${type}`;

  const h4 = document.createElement('h4');
  h4.textContent = title;
  alertDiv.appendChild(h4);

  // Build the message paragraph only if needed
  if (message || type === 'error' || type === 'warning') {
    const p = document.createElement('p');
    p.style.margin = '0';

    let content = message || '';

    // Append "Contact us" only for error & warning
    if (type === 'error' || type === 'warning') {
      if (content) content += ' ';
      content += `<a href="/support">Contact us</a>`;
    }

    p.innerHTML = content;
    alertDiv.appendChild(p);
  }

  container.appendChild(alertDiv);
}
