const BLOCKED_TAGS = ['script', 'iframe', 'object', 'embed', 'form', 'style', 'link', 'meta'];

const isSafeUrl = (value) => {
  if (!value) return true;

  const normalizedValue = value.trim().toLowerCase();
  return !(
    normalizedValue.startsWith('javascript:') ||
    normalizedValue.startsWith('data:text/html') ||
    normalizedValue.startsWith('vbscript:')
  );
};

export const sanitizeHtml = (html) => {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return '';
  }

  const parser = new DOMParser();
  const documentFragment = parser.parseFromString(html || '', 'text/html');

  BLOCKED_TAGS.forEach((tagName) => {
    documentFragment.querySelectorAll(tagName).forEach((element) => element.remove());
  });

  documentFragment.querySelectorAll('*').forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();
      const attributeValue = attribute.value;

      if (attributeName.startsWith('on')) {
        element.removeAttribute(attribute.name);
        return;
      }

      if ((attributeName === 'href' || attributeName === 'src') && !isSafeUrl(attributeValue)) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return documentFragment.body.innerHTML;
};
