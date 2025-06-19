import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeGenerationPanel } from '@/components/figma-generator/CodeGenerationPanel';
import { CodePreviewPanel } from '@/components/figma-generator/CodePreviewPanel';
import { AnalysisPanel } from '@/components/figma-generator/AnalysisPanel';
import { 
  Code2, 
  Settings, 
  Download, 
  History,
  Eye,
  MessageCircleQuestion,
  Plus
} from 'lucide-react';
import { 
  GeneratedComponent, 
  CodeGenerationOptions, 
  CustomCodeInputs,
  FigmaApiResponse 
} from '@shared/types';
import { AdvancedCodeGenerator } from '@/services/advanced-code-generator';
import { downloadZip } from '@/utils/code-formatter';

// Mock Figma data for demo purposes
const mockFigmaData: FigmaApiResponse = {
  document: {
    id: '1:1',
    name: 'E-commerce Dashboard',
    type: 'DOCUMENT',
    children: [
      {
        id: '1:2',
        name: 'ProductCard',
        type: 'FRAME',
        absoluteBoundingBox: { x: 0, y: 0, width: 320, height: 400 },
        backgroundColor: { r: 1, g: 1, b: 1, a: 1 },
        cornerRadius: 12,
        children: [
          {
            id: '1:3',
            name: 'Product Image',
            type: 'RECTANGLE',
            absoluteBoundingBox: { x: 16, y: 16, width: 288, height: 200 },
            fills: [{ type: 'IMAGE', imageRef: 'product-image.jpg' }],
            cornerRadius: 8
          },
          {
            id: '1:4',
            name: 'Product Title',
            type: 'TEXT',
            characters: 'Premium Wireless Headphones',
            absoluteBoundingBox: { x: 16, y: 240, width: 288, height: 32 },
            style: {
              fontFamily: 'Inter',
              fontSize: 18,
              fontWeight: 600,
              lineHeightPx: 24,
              letterSpacing: 0,
              fills: [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1, a: 1 } }]
            }
          }
        ]
      }
    ]
  },
  components: {
    '1:2': { key: '1:2', name: 'ProductCard', description: 'Product card component' }
  },
  name: 'E-commerce Dashboard',
  version: '1.0.0',
  lastModified: new Date().toISOString()
};

export default function FigmaGenerator() {
  const [components, setComponents] = useState<GeneratedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<GeneratedComponent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(85);

  const handleGenerate = async (options: CodeGenerationOptions, customCode: CustomCodeInputs) => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const generator = new AdvancedCodeGenerator(mockFigmaData, options);
      generator.setCustomCode(customCode);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      const generatedComponents = await generator.generateComponents();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setComponents(generatedComponents);
      if (generatedComponents.length > 0) {
        setSelectedComponent(generatedComponents[0]);
      }
    } catch (error) {
      console.error('Code generation failed:', error);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgress(85), 1000); // Reset to demo value
    }
  };

  const handleCopy = (content: string, type: string) => {
    console.log(`Copied ${type}:`, content.substring(0, 100) + '...');
  };

  const handleDownload = (content: string, filename: string) => {
    console.log(`Downloaded: ${filename}`);
  };

  const handlePreview = (component: GeneratedComponent) => {
    console.log('Opening preview for:', component.name);
    // In a real implementation, open preview in new window/iframe
  };

  const handleExport = async (format: string) => {
    if (!selectedComponent) return;
    
    const files = [
      { name: `${selectedComponent.name}.tsx`, content: selectedComponent.jsx },
      { name: `${selectedComponent.name}.css`, content: selectedComponent.css },
    ];
    
    if (selectedComponent.typescript) {
      files.push({ name: `${selectedComponent.name}.d.ts`, content: selectedComponent.typescript });
    }
    
    if (selectedComponent.tests) {
      files.push({ name: `${selectedComponent.name}.test.tsx`, content: selectedComponent.tests });
    }
    
    if (selectedComponent.stories) {
      files.push({ name: `${selectedComponent.name}.stories.tsx`, content: selectedComponent.stories });
    }
    
    switch (format) {
      case 'zip':
        await downloadZip(files);
        break;
      case 'codesandbox':
        console.log('Opening in CodeSandbox...');
        break;
      case 'github':
        console.log('Creating GitHub Gist...');
        break;
      case 'storybook':
        console.log('Exporting to Storybook...');
        break;
    }
  };

  const handleExportAll = async () => {
    if (components.length === 0) return;
    
    const allFiles: Array<{name: string, content: string}> = [];
    
    components.forEach(component => {
      allFiles.push(
        { name: `${component.name}.tsx`, content: component.jsx },
        { name: `${component.name}.css`, content: component.css }
      );
      
      if (component.typescript) {
        allFiles.push({ name: `${component.name}.d.ts`, content: component.typescript });
      }
      
      if (component.tests) {
        allFiles.push({ name: `${component.name}.test.tsx`, content: component.tests });
      }
      
      if (component.stories) {
        allFiles.push({ name: `${component.name}.stories.tsx`, content: component.stories });
      }
    });
    
    await downloadZip(allFiles);
  };

  return (
    <div className="min-h-screen bg-editor-bg text-text-primary">
      
      {/* Header */}
      <header className="bg-editor-panel border-b border-editor-border sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code2 className="text-brand-primary text-xl" />
              <h1 className="text-lg font-semibold">Advanced Figma Code Generator</h1>
              <Badge className="bg-brand-primary/20 text-brand-primary border-brand-primary/30">PRO</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
              <History className="w-4 h-4 mr-1" />
              History
            </Button>
            
            <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
              <Settings className="w-4 h-4 mr-1" />
              Settings
            </Button>
            
            <Button 
              onClick={handleExportAll}
              disabled={components.length === 0}
              className="bg-brand-primary hover:bg-brand-success"
            >
              <Download className="w-4 h-4 mr-1" />
              Export All
            </Button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex h-screen pt-[60px]">
        
        {/* Configuration Panel */}
        <CodeGenerationPanel
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          progress={progress}
        />

        {/* Code Preview Panel */}
        <CodePreviewPanel
          components={components}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onPreview={handlePreview}
        />

        {/* Analysis Panel */}
        <AnalysisPanel
          selectedComponent={selectedComponent}
          onExport={handleExport}
        />
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col space-y-2">
          <Button 
            size="icon"
            className="w-12 h-12 bg-brand-primary hover:bg-brand-success rounded-full shadow-lg"
            title="Generate new component"
            onClick={() => handleGenerate(
              {
                framework: 'react',
                styling: 'tailwind',
                buildSystem: 'vite',
                typescript: true,
                accessibility: true,
                responsive: true,
                imageOptimization: true,
                performanceOptimization: false,
                unitTests: false,
              },
              { javascript: '', css: '', animations: '' }
            )}
          >
            <Plus className="w-5 h-5" />
          </Button>
          
          <Button 
            size="icon"
            variant="secondary"
            className="w-12 h-12 bg-editor-panel hover:bg-editor-hover border border-editor-border rounded-full shadow-lg"
            title="Live preview"
            onClick={() => selectedComponent && handlePreview(selectedComponent)}
          >
            <Eye className="w-5 h-5" />
          </Button>
          
          <Button 
            size="icon"
            variant="secondary"
            className="w-12 h-12 bg-editor-panel hover:bg-editor-hover border border-editor-border rounded-full shadow-lg"
            title="Help & documentation"
          >
            <MessageCircleQuestion className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
