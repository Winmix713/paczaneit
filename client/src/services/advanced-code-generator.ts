import { 
  FigmaNode, 
  FigmaApiResponse, 
  GeneratedComponent, 
  ComponentMetadata, 
  AccessibilityReport, 
  ResponsiveBreakpoints,
  CodeGenerationOptions,
  CustomCodeInputs,
  PerformanceMetrics,
  QualityMetrics,
  AISuggestion,
  AccessibilityIssue
} from '@shared/types';

export class AdvancedCodeGenerator {
  private figmaData: FigmaApiResponse;
  private options: CodeGenerationOptions;
  private customCode: CustomCodeInputs = { javascript: '', css: '', animations: '' };

  constructor(figmaData: FigmaApiResponse, options: CodeGenerationOptions) {
    this.figmaData = figmaData;
    this.options = options;
  }

  setCustomCode(customCode: CustomCodeInputs) {
    this.customCode = customCode;
  }

  async generateComponents(): Promise<GeneratedComponent[]> {
    const components: GeneratedComponent[] = [];
    
    // Find components or main frames
    const nodesToGenerate = this.findComponentNodes();
    
    for (const node of nodesToGenerate) {
      const component = await this.generateSingleComponent(node);
      components.push(component);
    }

    return components;
  }

  private findComponentNodes(): FigmaNode[] {
    const nodes: FigmaNode[] = [];
    
    // Look for components first
    if (this.figmaData.components) {
      Object.entries(this.figmaData.components).forEach(([key, comp]) => {
        const node = this.findNodeById(comp.key);
        if (node) {
          nodes.push(node);
        }
      });
    }

    // If no components, find main frames
    if (nodes.length === 0) {
      const mainFrames = this.findMainFrames(this.figmaData.document);
      nodes.push(...mainFrames);
    }

    return nodes;
  }

  private findNodeById(id: string): FigmaNode | null {
    const search = (node: FigmaNode): FigmaNode | null => {
      if (node.id === id) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = search(child);
          if (found) return found;
        }
      }
      return null;
    };
    return search(this.figmaData.document);
  }

  private findMainFrames(node: FigmaNode): FigmaNode[] {
    const frames: FigmaNode[] = [];
    
    if (node.type === 'FRAME' && node.name && !node.name.startsWith('_')) {
      frames.push(node);
    }
    
    if (node.children) {
      for (const child of node.children) {
        frames.push(...this.findMainFrames(child));
      }
    }
    
    return frames;
  }

  private async generateSingleComponent(node: FigmaNode): Promise<GeneratedComponent> {
    const startTime = Date.now();
    const sanitizedName = this.sanitizeComponentName(node.name);
    
    // Generate code
    const jsx = await this.generateJSX(node, sanitizedName);
    const css = await this.generateCSS(node, sanitizedName);
    const typescript = this.options.typescript ? await this.generateTypeScript(node, sanitizedName) : undefined;
    const tests = this.options.unitTests ? await this.generateTests(node, sanitizedName) : undefined;
    const stories = await this.generateStories(node, sanitizedName);
    
    // Analyze component
    const accessibility = await this.analyzeAccessibility(node);
    const responsive = await this.analyzeResponsive(node);
    const performance = await this.analyzePerformance(jsx, css);
    const metadata = this.generateMetadata(node, Date.now() - startTime, performance);

    return {
      id: node.id,
      name: sanitizedName,
      jsx,
      css,
      typescript,
      tests,
      stories,
      accessibility,
      responsive,
      metadata,
    };
  }

  private async generateJSX(node: FigmaNode, componentName: string): Promise<string> {
    const props = this.extractProps(node);
    const imports = this.generateImports();
    const propsInterface = this.options.typescript ? this.generatePropsInterface(props, componentName) : '';
    
    let componentBody = '';
    
    if (this.options.framework === 'react' || this.options.framework === 'nextjs') {
      const hooks = this.generateHooks(node);
      const handlers = this.generateEventHandlers(node);
      const customLogic = this.customCode.javascript ? `\n  // === CUSTOM JAVASCRIPT CODE ===\n  ${this.customCode.javascript}\n  // === END CUSTOM CODE ===\n` : '';
      
      componentBody = `${this.generateJSXElement(node, 1)}`;
      
      const componentSignature = this.options.typescript 
        ? `export const ${componentName}: React.FC<${componentName}Props> = ({ ${props.map(p => p.name).join(', ')} })`
        : `export const ${componentName} = ({ ${props.map(p => p.name).join(', ')} })`;

      return `${imports}
${propsInterface}
${componentSignature} => {${hooks}${handlers}${customLogic}
  return (
    ${componentBody}
  );
};

export default ${componentName};`;
    }

    // Add Vue, Svelte, HTML implementations here
    return componentBody;
  }

  private generateImports(): string {
    const imports = ['import React, { useState, useCallback, useMemo } from \'react\';'];
    
    if (this.options.framework === 'nextjs') {
      imports.push('import Image from \'next/image\';');
    }
    
    if (this.options.styling === 'styled-components') {
      imports.push('import styled from \'styled-components\';');
    }
    
    if (this.customCode.animations) {
      imports.push('import { motion, AnimatePresence } from \'framer-motion\';');
    }
    
    imports.push('import clsx from \'clsx\';');
    
    return imports.join('\n');
  }

  private generatePropsInterface(props: Array<{name: string, type: string, optional: boolean}>, componentName: string): string {
    return `
interface ${componentName}Props {
  ${props.map(p => `/** ${p.name} property */\n  ${p.name}${p.optional ? '?' : ''}: ${p.type};`).join('\n  ')}
  /** Custom styling */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
}
`;
  }

  private generateHooks(node: FigmaNode): string {
    const hooks: string[] = [];
    
    if (this.isInteractiveElement(node)) {
      hooks.push('  const [isHovered, setIsHovered] = useState(false);');
      hooks.push('  const [isPressed, setIsPressed] = useState(false);');
    }
    
    if (this.hasImageContent(node)) {
      hooks.push('  const [imageLoaded, setImageLoaded] = useState(false);');
    }
    
    return hooks.length > 0 ? '\n' + hooks.join('\n') + '\n' : '';
  }

  private generateEventHandlers(node: FigmaNode): string {
    const handlers: string[] = [];
    
    if (this.isInteractiveElement(node)) {
      handlers.push(`  const handleClick = useCallback((event: React.MouseEvent) => {
    // Handle click event
    console.log('${node.name} clicked');
  }, []);`);
      
      handlers.push(`  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick(event as any);
    }
  }, [handleClick]);`);
    }
    
    return handlers.length > 0 ? '\n' + handlers.join('\n\n') + '\n' : '';
  }

  private generateJSXElement(node: FigmaNode, depth: number): string {
    const indent = '  '.repeat(depth);
    const tag = this.getHtmlTag(node);
    const className = this.generateClassName(node);
    const attributes = this.generateAttributes(node);
    const children = this.generateChildren(node, depth + 1);
    
    if (node.type === 'TEXT' && node.characters) {
      return `${indent}<${tag}${className ? ` className="${className}"` : ''}${attributes}>
${indent}  {${JSON.stringify(node.characters)}}
${indent}</${tag}>`;
    }

    if (children) {
      return `${indent}<${tag}${className ? ` className="${className}"` : ''}${attributes}>
${children}
${indent}</${tag}>`;
    }

    return `${indent}<${tag}${className ? ` className="${className}"` : ''}${attributes} />`;
  }

  private generateChildren(node: FigmaNode, depth: number): string {
    if (!node.children || node.children.length === 0) return '';
    
    return node.children
      .filter(child => child.visible !== false)
      .map(child => this.generateJSXElement(child, depth))
      .join('\n');
  }

  private async generateCSS(node: FigmaNode, componentName: string): Promise<string> {
    let baseCSS = '';
    
    if (this.options.styling === 'tailwind') {
      baseCSS = this.generateTailwindCSS(node, componentName);
    } else {
      const styles = this.extractAllStyles(node);
      baseCSS = this.convertToCSSRules(styles, componentName);
    }

    // Add custom CSS
    const customCSS = this.customCode.css ? `\n\n/* === CUSTOM CSS STYLES === */\n${this.customCode.css}\n/* === END CUSTOM STYLES === */` : '';
    
    // Add animations
    const animations = this.customCode.animations ? `\n\n/* === CUSTOM ANIMATIONS === */\n${this.customCode.animations}\n/* === END ANIMATIONS === */` : '';

    return `${baseCSS}${customCSS}${animations}`;
  }

  private generateTailwindCSS(node: FigmaNode, componentName: string): string {
    const classes = this.generateTailwindClasses(node);
    
    return `/* Generated Tailwind CSS for ${componentName} */
@layer components {
  .${componentName.toLowerCase()} {
    @apply ${classes};
  }
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .${componentName.toLowerCase()} {
    @apply text-sm p-2;
  }
}

@media (min-width: 1024px) {
  .${componentName.toLowerCase()} {
    @apply text-lg p-6;
  }
}`;
  }

  private generateTailwindClasses(node: FigmaNode): string {
    const classes: string[] = ['relative'];

    // Layout
    if (node.layoutMode === 'HORIZONTAL') {
      classes.push('flex', 'flex-row');
    } else if (node.layoutMode === 'VERTICAL') {
      classes.push('flex', 'flex-col');
    }

    // Spacing
    if (node.itemSpacing) {
      classes.push(`gap-${Math.round(node.itemSpacing / 4)}`);
    }

    // Padding
    if (node.paddingLeft) classes.push(`pl-${Math.round(node.paddingLeft / 4)}`);
    if (node.paddingRight) classes.push(`pr-${Math.round(node.paddingRight / 4)}`);
    if (node.paddingTop) classes.push(`pt-${Math.round(node.paddingTop / 4)}`);
    if (node.paddingBottom) classes.push(`pb-${Math.round(node.paddingBottom / 4)}`);

    // Size
    if (node.absoluteBoundingBox) {
      const { width, height } = node.absoluteBoundingBox;
      if (width < 100) classes.push('w-auto');
      else if (width < 300) classes.push('w-full', 'max-w-sm');
      else classes.push('w-full');
      
      if (height < 50) classes.push('h-auto');
      else classes.push('min-h-[' + height + 'px]');
    }

    // Background
    if (node.backgroundColor) {
      classes.push(this.colorToTailwind(node.backgroundColor));
    }

    // Border radius
    if (node.cornerRadius) {
      if (node.cornerRadius <= 4) classes.push('rounded');
      else if (node.cornerRadius <= 8) classes.push('rounded-lg');
      else classes.push('rounded-xl');
    }

    // Text styles
    if (node.type === 'TEXT' && node.style) {
      const fontSize = node.style.fontSize;
      if (fontSize <= 12) classes.push('text-xs');
      else if (fontSize <= 14) classes.push('text-sm');
      else if (fontSize <= 16) classes.push('text-base');
      else if (fontSize <= 18) classes.push('text-lg');
      else if (fontSize <= 24) classes.push('text-xl');
      else classes.push('text-2xl');
      
      if (node.style.fontWeight >= 600) {
        classes.push('font-semibold');
      } else if (node.style.fontWeight >= 500) {
        classes.push('font-medium');
      }
    }

    // Interactive states
    if (this.isInteractiveElement(node)) {
      classes.push('cursor-pointer', 'transition-all', 'duration-300');
      classes.push('hover:scale-105', 'hover:shadow-lg');
      classes.push('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
    }

    return classes.join(' ');
  }

  private colorToTailwind(color: any): string {
    const { r, g, b } = color;
    
    if (r > 0.9 && g > 0.9 && b > 0.9) return 'bg-white';
    if (r < 0.1 && g < 0.1 && b < 0.1) return 'bg-black';
    if (r > 0.8 && g < 0.3 && b < 0.3) return 'bg-red-500';
    if (r < 0.3 && g > 0.8 && b < 0.3) return 'bg-green-500';
    if (r < 0.3 && g < 0.3 && b > 0.8) return 'bg-blue-500';
    if (r > 0.5 && g > 0.5 && b < 0.3) return 'bg-yellow-500';
    if (r > 0.5 && g < 0.3 && b > 0.5) return 'bg-purple-500';
    
    return 'bg-gray-500';
  }

  private async generateTypeScript(node: FigmaNode, componentName: string): Promise<string> {
    const props = this.extractProps(node);
    
    return `// Type definitions for ${componentName}
export interface ${componentName}Props {
  ${props.map(p => `/** ${p.name} property */\n  ${p.name}${p.optional ? '?' : ''}: ${p.type};`).join('\n  ')}
  /** Custom styling */
  className?: string;
  /** Component children */
  children?: React.ReactNode;
}

// Component state types
export interface ${componentName}State {
  isHovered: boolean;
  isPressed: boolean;
  imageLoaded: boolean;
}

// Event handler types
export type ${componentName}ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;
export type ${componentName}KeyHandler = (event: React.KeyboardEvent<HTMLElement>) => void;`;
  }

  private async generateTests(node: FigmaNode, componentName: string): Promise<string> {
    return `import { render, screen, fireEvent } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName} />);
    expect(screen.getByRole('${this.getAriaRole(node)}')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-test-class';
    render(<${componentName} className={customClass} />);
    expect(screen.getByRole('${this.getAriaRole(node)}')).toHaveClass(customClass);
  });

  ${this.isInteractiveElement(node) ? `
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<${componentName} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('${this.getAriaRole(node)}'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation', () => {
    const handleClick = jest.fn();
    render(<${componentName} onClick={handleClick} />);
    const element = screen.getByRole('${this.getAriaRole(node)}');
    fireEvent.keyDown(element, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });` : ''}
});`;
  }

  private async generateStories(node: FigmaNode, componentName: string): Promise<string> {
    return `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Generated from Figma design: ${node.name}',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomStyle: Story = {
  args: {
    className: 'border-2 border-blue-500',
  },
};

${this.isInteractiveElement(node) ? `
export const Interactive: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    // Add interaction tests here
  },
};` : ''}`;
  }

  private async analyzeAccessibility(node: FigmaNode): Promise<AccessibilityReport> {
    const issues: AccessibilityIssue[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check for missing alt text on images
    if (this.hasImageContent(node)) {
      issues.push({
        type: 'error',
        message: 'Image elements require alt text for screen readers',
        element: node.name,
        fix: 'Add alt attribute with descriptive text',
        severity: 'high'
      });
      score -= 20;
    }

    // Check text contrast
    if (node.type === 'TEXT') {
      const contrastRatio = this.calculateContrastRatio(node);
      if (contrastRatio < 4.5) {
        issues.push({
          type: 'warning',
          message: 'Text contrast ratio below WCAG AA standards',
          element: node.name,
          fix: 'Increase contrast between text and background colors',
          severity: 'medium'
        });
        score -= 15;
      }
    }

    // Check interactive elements
    if (this.isInteractiveElement(node)) {
      suggestions.push('Ensure keyboard navigation is properly implemented');
      suggestions.push('Add ARIA labels for screen reader compatibility');
      suggestions.push('Implement proper focus management');
    }

    // Check for proper heading hierarchy
    if (this.isHeading(node)) {
      suggestions.push('Verify heading hierarchy follows semantic order (h1 > h2 > h3...)');
    }

    // Custom code accessibility
    if (this.customCode.javascript || this.customCode.css) {
      suggestions.push('Review custom code for accessibility compliance');
      suggestions.push('Test with screen readers and keyboard navigation');
    }

    return {
      score: Math.max(0, score),
      wcagCompliance: score >= 90 ? 'AAA' : score >= 80 ? 'AA' : score >= 60 ? 'A' : 'Non-compliant',
      issues,
      suggestions,
    };
  }

  private async analyzeResponsive(node: FigmaNode): Promise<ResponsiveBreakpoints> {
    const hasFlexLayout = node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL';
    const hasConstraints = node.constraints?.horizontal !== 'LEFT' || node.constraints?.vertical !== 'TOP';

    return {
      mobile: this.generateResponsiveCSS(node, 'mobile'),
      tablet: this.generateResponsiveCSS(node, 'tablet'),
      desktop: this.generateResponsiveCSS(node, 'desktop'),
      hasResponsiveDesign: hasFlexLayout || hasConstraints
    };
  }

  private async analyzePerformance(jsx: string, css: string): Promise<PerformanceMetrics> {
    const bundleSize = this.calculateBundleSize(jsx, css);
    const linesOfCode = jsx.split('\n').length + css.split('\n').length;
    
    return {
      bundleSize: `${bundleSize}KB`,
      linesOfCode,
      renderPerformance: linesOfCode < 100 ? 'excellent' : linesOfCode < 200 ? 'good' : linesOfCode < 400 ? 'moderate' : 'poor',
      memoryUsage: bundleSize < 5 ? 'low' : bundleSize < 15 ? 'moderate' : 'high',
      bundleImpact: bundleSize < 10 ? 'low' : bundleSize < 25 ? 'moderate' : 'high'
    };
  }

  private generateMetadata(node: FigmaNode, generationTime: number, performance: PerformanceMetrics): ComponentMetadata {
    return {
      figmaNodeId: node.id,
      componentType: this.detectComponentType(node),
      complexity: this.calculateComplexity(node),
      estimatedAccuracy: this.estimateAccuracy(node),
      generationTime,
      dependencies: this.extractDependencies(node),
      performance
    };
  }

  // Helper methods
  private sanitizeComponentName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[0-9]/, 'Component$&')
      .replace(/^./, str => str.toUpperCase());
  }

  private extractProps(node: FigmaNode): Array<{name: string, type: string, optional: boolean}> {
    const props = [];
    
    if (node.type === 'TEXT' && node.characters) {
      props.push({ name: 'text', type: 'string', optional: true });
    }
    
    if (this.hasImageContent(node)) {
      props.push({ name: 'src', type: 'string', optional: false });
      props.push({ name: 'alt', type: 'string', optional: false });
    }

    if (this.isInteractiveElement(node)) {
      props.push({ name: 'onClick', type: '(event: React.MouseEvent) => void', optional: true });
      props.push({ name: 'disabled', type: 'boolean', optional: true });
    }
    
    return props;
  }

  private generateClassName(node: FigmaNode): string {
    if (this.options.styling === 'tailwind') {
      return this.generateTailwindClasses(node);
    }
    return `${node.name.toLowerCase().replace(/\s+/g, '-')}`;
  }

  private generateAttributes(node: FigmaNode): string {
    const attrs: string[] = [];
    
    if (this.isInteractiveElement(node)) {
      attrs.push('onClick={handleClick}');
      attrs.push('onKeyDown={handleKeyDown}');
      attrs.push('tabIndex={0}');
      attrs.push(`role="${this.getAriaRole(node)}"`);
      attrs.push(`aria-label="${node.name}"`);
    }

    return attrs.length > 0 ? ' ' + attrs.join(' ') : '';
  }

  private getHtmlTag(node: FigmaNode): string {
    switch (node.type) {
      case 'TEXT': return this.isHeading(node) ? 'h2' : 'span';
      case 'FRAME': return 'div';
      case 'RECTANGLE': return this.hasImageContent(node) ? 'img' : 'div';
      case 'COMPONENT': return 'div';
      default: return 'div';
    }
  }

  private getAriaRole(node: FigmaNode): string {
    if (this.isInteractiveElement(node)) return 'button';
    if (this.isHeading(node)) return 'heading';
    return 'generic';
  }

  private isInteractiveElement(node: FigmaNode): boolean {
    const name = node.name.toLowerCase();
    return name.includes('button') || 
           name.includes('link') ||
           name.includes('click') ||
           name.includes('action');
  }

  private isHeading(node: FigmaNode): boolean {
    const name = node.name.toLowerCase();
    return node.type === 'TEXT' && (
      name.includes('title') ||
      name.includes('heading') ||
      name.includes('header') ||
      /h[1-6]/.test(name)
    );
  }

  private hasImageContent(node: FigmaNode): boolean {
    return node.fills?.some(f => f.type === 'IMAGE') || 
           node.name.toLowerCase().includes('image') ||
           node.name.toLowerCase().includes('photo') ||
           node.name.toLowerCase().includes('avatar');
  }

  private extractAllStyles(node: FigmaNode): Record<string, any> {
    const styles: Record<string, any> = {};

    if (node.absoluteBoundingBox) {
      const { width, height } = node.absoluteBoundingBox;
      styles.width = `${width}px`;
      styles.height = `${height}px`;
    }

    if (node.backgroundColor) {
      styles.backgroundColor = this.colorToCSS(node.backgroundColor);
    }

    if (node.cornerRadius) {
      styles.borderRadius = `${node.cornerRadius}px`;
    }

    return styles;
  }

  private colorToCSS(color: any): string {
    const { r, g, b, a = 1 } = color;
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
  }

  private convertToCSSRules(styles: Record<string, any>, componentName: string): string {
    const cssRules = Object.entries(styles)
      .map(([property, value]) => `  ${property}: ${value};`)
      .join('\n');
    
    return `.${componentName.toLowerCase()} {\n${cssRules}\n}`;
  }

  private calculateContrastRatio(node: FigmaNode): number {
    // Simplified contrast calculation
    return 4.5; // Assume good contrast for now
  }

  private generateResponsiveCSS(node: FigmaNode, breakpoint: string): string {
    return `/* ${breakpoint} styles for ${node.name} */`;
  }

  private detectComponentType(node: FigmaNode): ComponentMetadata['componentType'] {
    const name = node.name.toLowerCase();
    
    if (name.includes('button')) return 'button';
    if (name.includes('card')) return 'card';
    if (name.includes('text') || node.type === 'TEXT') return 'text';
    if (name.includes('input') || name.includes('field')) return 'input';
    if (node.children && node.children.length > 3) return 'layout';
    
    return 'complex';
  }

  private calculateComplexity(node: FigmaNode): ComponentMetadata['complexity'] {
    let complexity = 0;
    
    if (node.children) complexity += node.children.length;
    if (node.effects && node.effects.length > 0) complexity += 2;
    if (node.fills && node.fills.length > 1) complexity += 1;
    
    if (complexity <= 3) return 'simple';
    if (complexity <= 8) return 'medium';
    return 'complex';
  }

  private estimateAccuracy(node: FigmaNode): number {
    let accuracy = 85;
    
    if (this.calculateComplexity(node) === 'simple') accuracy += 10;
    if (node.children && node.children.length > 5) accuracy -= 5;
    
    const componentType = this.detectComponentType(node);
    if (['button', 'text', 'card'].includes(componentType)) accuracy += 5;
    
    return Math.min(100, Math.max(70, accuracy));
  }

  private extractDependencies(node: FigmaNode): string[] {
    const deps = ['react'];
    
    if (this.options.typescript) deps.push('@types/react');
    if (this.hasImageContent(node) && this.options.framework === 'nextjs') deps.push('next/image');
    if (this.customCode.animations) deps.push('framer-motion');
    if (this.options.styling === 'styled-components') deps.push('styled-components');
    
    return deps;
  }

  private calculateBundleSize(jsx: string, css: string): number {
    // Simplified bundle size calculation (KB)
    return Math.ceil((jsx.length + css.length) / 1024);
  }

  // AI Suggestions Generator
  generateAISuggestions(component: GeneratedComponent): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    // Performance suggestions
    if (component.metadata.performance.bundleImpact === 'high') {
      suggestions.push({
        type: 'performance',
        title: 'Bundle Size Optimization',
        description: 'Consider lazy loading and code splitting to reduce bundle impact',
        priority: 'high',
        icon: 'fas fa-tachometer-alt',
        color: 'text-yellow-400'
      });
    }

    // Accessibility suggestions
    if (component.accessibility.score < 90) {
      suggestions.push({
        type: 'accessibility',
        title: 'Accessibility Enhancement',
        description: 'Improve WCAG compliance by addressing identified accessibility issues',
        priority: 'high',
        icon: 'fas fa-universal-access',
        color: 'text-blue-400'
      });
    }

    // Design suggestions
    if (component.metadata.complexity === 'complex') {
      suggestions.push({
        type: 'design',
        title: 'Component Simplification',
        description: 'Consider breaking down complex components into smaller, reusable parts',
        priority: 'medium',
        icon: 'fas fa-puzzle-piece',
        color: 'text-purple-400'
      });
    }

    return suggestions;
  }

  // Quality Metrics Calculator
  calculateQualityMetrics(component: GeneratedComponent): QualityMetrics {
    return {
      overall: Math.round((
        component.metadata.estimatedAccuracy +
        component.accessibility.score +
        (component.metadata.performance.renderPerformance === 'excellent' ? 95 : 
         component.metadata.performance.renderPerformance === 'good' ? 80 : 65) +
        (component.responsive.hasResponsiveDesign ? 90 : 70)
      ) / 4),
      accuracy: component.metadata.estimatedAccuracy,
      performance: component.metadata.performance.renderPerformance === 'excellent' ? 95 : 
                  component.metadata.performance.renderPerformance === 'good' ? 80 : 65,
      accessibility: component.accessibility.score,
      responsiveness: component.responsive.hasResponsiveDesign ? 90 : 70
    };
  }
}
