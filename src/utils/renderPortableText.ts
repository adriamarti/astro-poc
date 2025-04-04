import { toHTML, type PortableTextBlockComponent } from '@portabletext/to-html';

export function renderPortableText(blocks: any[]) {
  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }) =>
          `<img src="${value.asset?.url}" alt="${
            value.alt || ''
          }" class="my-4 rounded-lg" />`,
      },
      block: {
        h1: ({ children }) =>
          `<h1 class="text-3xl font-bold my-4">${children}</h1>`,
        h2: ({ children }) =>
          `<h2 class="text-2xl font-semibold my-3">${children}</h2>`,
        h3: ({ children }) =>
          `<h3 class="text-xl font-semibold my-3">${children}</h3>`,
        h4: ({ children }) =>
          `<h4 class="text-lg font-semibold my-2">${children}</h4>`,
        h5: ({ children }) =>
          `<h5 class="text-base font-medium my-2">${children}</h5>`,
        h6: ({ children }) =>
          `<h6 class="text-sm font-medium my-2">${children}</h6>`,
        normal: ({ children }) => `<p class="text-base my-2">${children}</p>`,
        blockquote: ({ children }) =>
          `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">${children}</blockquote>`,
      },

      marks: {
        link: ({ children, value }) =>
          `<a href="${value.href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${children}</a>`,
      },
    },
  });
}
