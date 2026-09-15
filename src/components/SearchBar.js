// Search Bar Component

export function renderSearchBar(container, onSearchChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'search-section';
  wrapper.id = 'search-section';

  wrapper.innerHTML = `
    <div class="container">
      <div class="search-box-wrapper">
        <div class="search-input-group">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            id="product-search-input" 
            class="search-input" 
            placeholder="Buscar por roll, salmón, palta, gyozas, hot roll..." 
            autocomplete="off"
            aria-label="Buscar productos"
          />
          <button type="button" class="search-clear-btn" id="search-clear-btn" style="display: none;" title="Limpiar búsqueda">✕</button>
        </div>
        <div class="search-results-feedback" id="search-feedback" style="display: none;"></div>
      </div>
    </div>
  `;

  const input = wrapper.querySelector('#product-search-input');
  const clearBtn = wrapper.querySelector('#search-clear-btn');
  const feedback = wrapper.querySelector('#search-feedback');

  const handleInput = (query) => {
    const trimmed = query.trim();
    if (trimmed.length > 0) {
      clearBtn.style.display = 'flex';
    } else {
      clearBtn.style.display = 'none';
      feedback.style.display = 'none';
    }
    if (onSearchChange) {
      const count = onSearchChange(trimmed);
      if (trimmed.length > 0) {
        feedback.style.display = 'block';
        feedback.textContent = count === 1 
          ? '1 producto encontrado' 
          : `${count} productos encontrados`;
      }
    }
  };

  input.addEventListener('input', (e) => handleInput(e.target.value));

  clearBtn.addEventListener('click', () => {
    input.value = '';
    handleInput('');
    input.focus();
  });

  container.appendChild(wrapper);

  return {
    setQuery(text) {
      input.value = text;
      handleInput(text);
    }
  };
}
