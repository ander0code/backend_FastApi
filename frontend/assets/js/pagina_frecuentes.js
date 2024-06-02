document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
  
      document.querySelectorAll('.accordion-button').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        btn.parentElement.classList.remove('active');
      });
  
      if (!isExpanded) {
        button.setAttribute('aria-expanded', 'true');
        faqItem.classList.add('active');
      }
    });
  });
  