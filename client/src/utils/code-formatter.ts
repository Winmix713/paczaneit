export class CodeFormatter {
  static formatJSX(code: string): string {
    // Basic JSX formatting - in production, use Prettier API
    return code
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  static formatCSS(code: string): string {
    // Basic CSS formatting
    return code
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n\n');
  }

  static formatTypeScript(code: string): string {
    // Basic TypeScript formatting
    return code
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  }

  static minifyCode(code: string): string {
    return code
      .replace(/\s+/g, ' ')
      .replace(/\n\s*/g, '')
      .trim();
  }

  static addLineNumbers(code: string): string {
    return code
      .split('\n')
      .map((line, index) => `${(index + 1).toString().padStart(3, ' ')} | ${line}`)
      .join('\n');
  }

  static highlightSyntax(code: string, language: string): string {
    // Basic syntax highlighting - in production, use Prism.js or similar
    if (language === 'jsx' || language === 'tsx') {
      return code
        .replace(/\b(import|export|const|let|var|function|return|if|else|for|while)\b/g, '<span class="keyword">$1</span>')
        .replace(/\b(React|useState|useEffect|useCallback|useMemo)\b/g, '<span class="react-keyword">$1</span>')
        .replace(/"([^"]*)"/g, '<span class="string">"$1"</span>')
        .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, '<span class="comment">$&</span>')
        .replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
    }
    
    return code;
  }
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }
};

export const downloadFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadZip = async (files: Array<{name: string, content: string}>): Promise<void> => {
  // In a real implementation, use JSZip or similar library
  const zip = await import('jszip').then(module => new module.default());
  
  files.forEach(file => {
    zip.file(file.name, file.content);
  });
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'generated-components.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
