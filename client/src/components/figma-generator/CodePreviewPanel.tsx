import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Download, 
  Play, 
  Clock,
  FileCode,
  FileType,
  TestTube,
  Book,
  CheckCircle
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { GeneratedComponent } from '@shared/types';
import { copyToClipboard, downloadFile } from '@/utils/code-formatter';

interface CodePreviewPanelProps {
  components: GeneratedComponent[];
  selectedComponent: GeneratedComponent | null;
  onSelectComponent: (component: GeneratedComponent) => void;
  onCopy: (content: string, type: string) => void;
  onDownload: (content: string, filename: string) => void;
  onPreview: (component: GeneratedComponent) => void;
}

export function CodePreviewPanel({ 
  components, 
  selectedComponent,
  onSelectComponent,
  onCopy,
  onDownload,
  onPreview
}: CodePreviewPanelProps) {
  const [activeTab, setActiveTab] = useState('jsx');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (content: string, type: string) => {
    try {
      await copyToClipboard(content);
      setCopied(type);
      onCopy(content, type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    downloadFile(content, filename);
    onDownload(content, filename);
  };

  const getFileExtension = (type: string) => {
    switch (type) {
      case 'jsx': return '.tsx';
      case 'css': return '.css';
      case 'typescript': return '.d.ts';
      case 'tests': return '.test.tsx';
      case 'stories': return '.stories.tsx';
      default: return '.txt';
    }
  };

  const getLanguage = (type: string) => {
    switch (type) {
      case 'jsx': return 'tsx';
      case 'css': return 'css';
      case 'typescript': return 'typescript';
      case 'tests': return 'tsx';
      case 'stories': return 'tsx';
      default: return 'text';
    }
  };

  const getCurrentContent = () => {
    if (!selectedComponent) return '';
    
    switch (activeTab) {
      case 'jsx': return selectedComponent.jsx;
      case 'css': return selectedComponent.css;
      case 'typescript': return selectedComponent.typescript || '';
      case 'tests': return selectedComponent.tests || '';
      case 'stories': return selectedComponent.stories || '';
      default: return '';
    }
  };

  const getCurrentLineCount = () => {
    return getCurrentContent().split('\n').length;
  };

  const getCurrentSize = () => {
    const content = getCurrentContent();
    const sizeKB = (content.length / 1024).toFixed(1);
    return `${sizeKB} KB`;
  };

  if (components.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-editor-bg">
        <div className="text-center">
          <FileCode className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Components Generated</h3>
          <p className="text-text-secondary">Configure your settings and generate code to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-editor-bg">
      
      {/* Component Selector */}
      <div className="bg-editor-panel border-b border-editor-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              value={selectedComponent?.id || ''}
              onValueChange={(value) => {
                const component = components.find(c => c.id === value);
                if (component) onSelectComponent(component);
              }}
            >
              <SelectTrigger className="w-64 bg-editor-hover border-editor-border text-text-primary">
                <SelectValue placeholder="Select component" />
              </SelectTrigger>
              <SelectContent className="bg-editor-panel border-editor-border">
                {components.map(component => (
                  <SelectItem key={component.id} value={component.id}>
                    {component.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {component.metadata.componentType}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedComponent && (
              <div className="flex items-center space-x-2 text-xs text-text-secondary">
                <Clock className="w-3 h-3" />
                <span>Generated {Math.round(selectedComponent.metadata.generationTime / 1000)}s ago</span>
                <Badge variant="outline" className="text-xs">
                  {selectedComponent.metadata.complexity}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectedComponent && handleCopy(getCurrentContent(), activeTab)}
              disabled={!selectedComponent}
            >
              {copied === activeTab ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectedComponent && handleDownload(
                getCurrentContent(), 
                `${selectedComponent.name}${getFileExtension(activeTab)}`
              )}
              disabled={!selectedComponent}
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            
            <Button
              size="sm"
              onClick={() => selectedComponent && onPreview(selectedComponent)}
              disabled={!selectedComponent}
              className="bg-brand-primary hover:bg-brand-success"
            >
              <Play className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Code Tabs */}
      <div className="bg-editor-panel border-b border-editor-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-12 bg-transparent border-0 rounded-none p-0">
            <TabsTrigger 
              value="jsx" 
              className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-primary data-[state=active]:bg-editor-bg text-sm font-medium px-4"
            >
              <FileCode className="w-4 h-4 mr-2 text-cyan-400" />
              Component.tsx
            </TabsTrigger>
            
            <TabsTrigger 
              value="css" 
              className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-primary data-[state=active]:bg-editor-bg text-sm font-medium px-4"
            >
              <FileType className="w-4 h-4 mr-2 text-blue-400" />
              Styles.css
            </TabsTrigger>
            
            {selectedComponent?.typescript && (
              <TabsTrigger 
                value="typescript" 
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-primary data-[state=active]:bg-editor-bg text-sm font-medium px-4"
              >
                <FileType className="w-4 h-4 mr-2 text-purple-400" />
                Types.d.ts
              </TabsTrigger>
            )}
            
            {selectedComponent?.tests && (
              <TabsTrigger 
                value="tests" 
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-primary data-[state=active]:bg-editor-bg text-sm font-medium px-4"
              >
                <TestTube className="w-4 h-4 mr-2 text-green-400" />
                Tests.spec.tsx
              </TabsTrigger>
            )}
            
            {selectedComponent?.stories && (
              <TabsTrigger 
                value="stories" 
                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-primary data-[state=active]:bg-editor-bg text-sm font-medium px-4"
              >
                <Book className="w-4 h-4 mr-2 text-orange-400" />
                Stories.stories.tsx
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-auto">
          <div className="min-h-full">
            {selectedComponent ? (
              <SyntaxHighlighter
                language={getLanguage(activeTab)}
                style={tomorrow}
                showLineNumbers
                lineNumberStyle={{
                  minWidth: '3em',
                  paddingRight: '1em',
                  paddingLeft: '0.5em',
                  color: '#6b7280',
                  borderRight: '1px solid #374151',
                  marginRight: '1em',
                  fontSize: '0.875rem'
                }}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  backgroundColor: '#1B1F23',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  fontFamily: 'JetBrains Mono, Consolas, monospace'
                }}
              >
                {getCurrentContent()}
              </SyntaxHighlighter>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileCode className="w-16 h-16 text-text-muted mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Select a Component</h3>
                  <p className="text-text-secondary">Choose a component from the dropdown to view its code</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-editor-panel border-t border-editor-border px-4 py-2 flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center space-x-4">
          <span>TypeScript React</span>
          <span>•</span>
          <span>UTF-8</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-brand-success" />
            <span>No errors</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>{getCurrentLineCount()} lines</span>
          <span>•</span>
          <span>{getCurrentSize()}</span>
          {selectedComponent && (
            <>
              <span>•</span>
              <span>Accuracy: {selectedComponent.metadata.estimatedAccuracy}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
