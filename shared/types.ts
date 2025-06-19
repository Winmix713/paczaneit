// Figma API Types
export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  children?: FigmaNode[];
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  backgroundColor?: FigmaColor;
  fills?: FigmaFill[];
  strokes?: FigmaStroke[];
  strokeWeight?: number;
  cornerRadius?: number;
  opacity?: number;
  effects?: FigmaEffect[];
  characters?: string;
  style?: FigmaTextStyle;
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  itemSpacing?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  constraints?: {
    horizontal: string;
    vertical: string;
  };
}

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface FigmaFill {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'IMAGE';
  color?: FigmaColor;
  opacity?: number;
  gradientHandlePositions?: any[];
  gradientStops?: any[];
  imageRef?: string;
}

export interface FigmaStroke {
  type: 'SOLID';
  color?: FigmaColor;
  opacity?: number;
}

export interface FigmaEffect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR';
  visible?: boolean;
  color?: FigmaColor;
  offset?: { x: number; y: number };
  radius?: number;
  opacity?: number;
}

export interface FigmaTextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeightPx: number;
  letterSpacing: number;
  fills?: FigmaFill[];
}

export interface FigmaApiResponse {
  document: FigmaNode;
  components?: Record<string, { key: string; name: string; description?: string }>;
  styles?: Record<string, any>;
  name: string;
  version: string;
  lastModified: string;
}

// Code Generation Types
export interface CodeGenerationOptions {
  framework: 'react' | 'nextjs' | 'vue' | 'svelte' | 'html';
  styling: 'tailwind' | 'styled-components' | 'css-modules' | 'emotion' | 'sass' | 'vanilla';
  buildSystem: 'vite' | 'webpack' | 'rollup' | 'parcel';
  typescript: boolean;
  accessibility: boolean;
  responsive: boolean;
  imageOptimization: boolean;
  performanceOptimization: boolean;
  unitTests: boolean;
}

export interface CustomCodeInputs {
  javascript: string;
  css: string;
  animations: string;
}

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  element: string;
  fix: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AccessibilityReport {
  score: number;
  wcagCompliance: 'AAA' | 'AA' | 'A' | 'Non-compliant';
  issues: AccessibilityIssue[];
  suggestions: string[];
}

export interface ResponsiveBreakpoints {
  mobile: string;
  tablet: string;
  desktop: string;
  hasResponsiveDesign: boolean;
}

export interface PerformanceMetrics {
  bundleSize: string;
  linesOfCode: number;
  renderPerformance: 'excellent' | 'good' | 'moderate' | 'poor';
  memoryUsage: 'low' | 'moderate' | 'high';
  bundleImpact: 'low' | 'moderate' | 'high';
}

export interface ComponentMetadata {
  figmaNodeId: string;
  componentType: 'button' | 'card' | 'text' | 'input' | 'layout' | 'complex';
  complexity: 'simple' | 'medium' | 'complex';
  estimatedAccuracy: number;
  generationTime: number;
  dependencies: string[];
  performance: PerformanceMetrics;
}

export interface GeneratedComponent {
  id: string;
  name: string;
  jsx: string;
  css: string;
  typescript?: string;
  tests?: string;
  stories?: string;
  accessibility: AccessibilityReport;
  responsive: ResponsiveBreakpoints;
  metadata: ComponentMetadata;
}

export interface QualityMetrics {
  overall: number;
  accuracy: number;
  performance: number;
  accessibility: number;
  responsiveness: number;
}

export interface AISuggestion {
  type: 'performance' | 'design' | 'accessibility' | 'code-quality';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
  color: string;
}
