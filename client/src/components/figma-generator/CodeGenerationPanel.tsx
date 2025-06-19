import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Layers, 
  Sliders, 
  Code2, 
  Rocket,
  History,
  Download,
  Palette,
  Sparkles,
  FileCode
} from 'lucide-react';
import { CodeGenerationOptions, CustomCodeInputs } from '@shared/types';

interface CodeGenerationPanelProps {
  onGenerate: (options: CodeGenerationOptions, customCode: CustomCodeInputs) => void;
  isGenerating: boolean;
  progress: number;
}

export function CodeGenerationPanel({ onGenerate, isGenerating, progress }: CodeGenerationPanelProps) {
  const [options, setOptions] = useState<CodeGenerationOptions>({
    framework: 'react',
    styling: 'tailwind',
    buildSystem: 'vite',
    typescript: true,
    accessibility: true,
    responsive: true,
    imageOptimization: true,
    performanceOptimization: false,
    unitTests: false,
  });

  const [customCode, setCustomCode] = useState<CustomCodeInputs>({
    javascript: '',
    css: '',
    animations: ''
  });

  const [showCustomCode, setShowCustomCode] = useState(false);

  const handleGenerate = () => {
    onGenerate(options, customCode);
  };

  return (
    <div className="h-full overflow-y-auto bg-editor-panel border-r border-editor-border">
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-brand-secondary" />
            <h2 className="text-lg font-semibold">Code Generator</h2>
            <Badge variant="secondary" className="bg-brand-primary/20 text-brand-primary">PRO</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <History className="w-4 h-4 mr-1" />
              History
            </Button>
          </div>
        </div>

        {/* Project Info */}
        <Card className="glass-panel border-editor-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-success rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-text-primary">E-commerce Dashboard</h3>
                <p className="text-text-secondary text-xs">12 components • Updated 2h ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-text-secondary">Generation Progress</span>
              <span className="text-brand-success font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Framework Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center text-text-primary">
            <Layers className="w-4 h-4 mr-2 text-brand-secondary" />
            Framework Configuration
          </h3>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-text-secondary mb-2 block">Target Framework</Label>
              <Select 
                value={options.framework} 
                onValueChange={(value: any) => setOptions({...options, framework: value})}
              >
                <SelectTrigger className="bg-editor-hover border-editor-border text-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-editor-panel border-editor-border">
                  <SelectItem value="react">React 18.x + TypeScript</SelectItem>
                  <SelectItem value="nextjs">Next.js 14.x + App Router</SelectItem>
                  <SelectItem value="vue">Vue 3.x + Composition API</SelectItem>
                  <SelectItem value="svelte">Svelte 4.x + SvelteKit</SelectItem>
                  <SelectItem value="html">HTML5 + Vanilla JS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-text-secondary mb-2 block">CSS Framework</Label>
              <Select 
                value={options.styling} 
                onValueChange={(value: any) => setOptions({...options, styling: value})}
              >
                <SelectTrigger className="bg-editor-hover border-editor-border text-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-editor-panel border-editor-border">
                  <SelectItem value="tailwind">Tailwind CSS v3.x</SelectItem>
                  <SelectItem value="styled-components">Styled Components</SelectItem>
                  <SelectItem value="css-modules">CSS Modules + PostCSS</SelectItem>
                  <SelectItem value="emotion">Emotion + CSS-in-JS</SelectItem>
                  <SelectItem value="sass">SASS/SCSS + BEM</SelectItem>
                  <SelectItem value="vanilla">Vanilla CSS + Custom Properties</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-text-secondary mb-2 block">Build System</Label>
              <Select 
                value={options.buildSystem} 
                onValueChange={(value: any) => setOptions({...options, buildSystem: value})}
              >
                <SelectTrigger className="bg-editor-hover border-editor-border text-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-editor-panel border-editor-border">
                  <SelectItem value="vite">Vite + ESBuild</SelectItem>
                  <SelectItem value="webpack">Webpack 5.x</SelectItem>
                  <SelectItem value="rollup">Rollup + Plugins</SelectItem>
                  <SelectItem value="parcel">Parcel 2.x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center text-text-primary">
            <Sliders className="w-4 h-4 mr-2 text-brand-secondary" />
            Advanced Features
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-text-primary">TypeScript Definitions</Label>
              <Switch 
                checked={options.typescript}
                onCheckedChange={(checked) => setOptions({...options, typescript: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-text-primary">Accessibility (WCAG 2.1 AA)</Label>
              <Switch 
                checked={options.accessibility}
                onCheckedChange={(checked) => setOptions({...options, accessibility: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-text-primary">Responsive Design</Label>
              <Switch 
                checked={options.responsive}
                onCheckedChange={(checked) => setOptions({...options, responsive: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-text-primary">Image Optimization</Label>
              <Switch 
                checked={options.imageOptimization}
                onCheckedChange={(checked) => setOptions({...options, imageOptimization: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-text-primary">Performance Optimization</Label>
              <Switch 
                checked={options.performanceOptimization}
                onCheckedChange={(checked) => setOptions({...options, performanceOptimization: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-sm text-text-primary">Unit Test Generation</Label>
              <Switch 
                checked={options.unitTests}
                onCheckedChange={(checked) => setOptions({...options, unitTests: checked})}
              />
            </div>
          </div>
        </div>

        {/* Custom Code Integration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center text-text-primary">
              <Code2 className="w-4 h-4 mr-2 text-brand-secondary" />
              Custom Code Integration
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomCode(!showCustomCode)}
            >
              {showCustomCode ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          {showCustomCode && (
            <Tabs defaultValue="javascript" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-editor-hover">
                <TabsTrigger value="javascript" className="text-xs">JavaScript</TabsTrigger>
                <TabsTrigger value="css" className="text-xs">CSS</TabsTrigger>
                <TabsTrigger value="animations" className="text-xs">Animations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="javascript" className="space-y-2">
                <Label className="text-xs text-text-secondary">Custom JavaScript Code</Label>
                <Textarea
                  placeholder={`// Custom logic and event handlers
const handleCustomClick = (e) => {
  console.log('Custom action');
};`}
                  value={customCode.javascript}
                  onChange={(e) => setCustomCode({...customCode, javascript: e.target.value})}
                  className="min-h-[120px] font-mono text-xs bg-editor-bg border-editor-border text-text-primary"
                />
              </TabsContent>
              
              <TabsContent value="css" className="space-y-2">
                <Label className="text-xs text-text-secondary">Custom CSS Styles</Label>
                <Textarea
                  placeholder={`/* Custom styles */
.custom-component {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 12px;
  padding: 1rem;
}`}
                  value={customCode.css}
                  onChange={(e) => setCustomCode({...customCode, css: e.target.value})}
                  className="min-h-[120px] font-mono text-xs bg-editor-bg border-editor-border text-text-primary"
                />
              </TabsContent>
              
              <TabsContent value="animations" className="space-y-2">
                <Label className="text-xs text-text-secondary">Advanced Animations</Label>
                <Textarea
                  placeholder={`/* Advanced animations */
@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.animated-element {
  animation: slideIn 0.3s ease-out;
}`}
                  value={customCode.animations}
                  onChange={(e) => setCustomCode({...customCode, animations: e.target.value})}
                  className="min-h-[120px] font-mono text-xs bg-editor-bg border-editor-border text-text-primary"
                />
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-brand-primary to-brand-success hover:from-brand-success hover:to-brand-primary text-white font-semibold py-3 transition-all duration-300 transform hover:scale-[1.02]"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Rocket className="w-4 h-4" />
              <span>Generate Production Code</span>
            </div>
          )}
        </Button>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-editor-hover border-editor-border">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-brand-success">47</div>
              <div className="text-xs text-text-secondary">Components</div>
            </CardContent>
          </Card>
          <Card className="bg-editor-hover border-editor-border">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-brand-secondary">92%</div>
              <div className="text-xs text-text-secondary">Accuracy</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
