import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Shield, 
  Zap, 
  Package, 
  Lightbulb, 
  Download,
  ExternalLink,
  FileArchive,
  Github,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { GeneratedComponent, QualityMetrics, AISuggestion } from '@shared/types';
import { AdvancedCodeGenerator } from '@/services/advanced-code-generator';

interface AnalysisPanelProps {
  selectedComponent: GeneratedComponent | null;
  onExport: (format: string) => void;
}

export function AnalysisPanel({ selectedComponent, onExport }: AnalysisPanelProps) {
  if (!selectedComponent) {
    return (
      <div className="w-80 bg-editor-panel border-l border-editor-border overflow-y-auto flex-shrink-0">
        <div className="p-6 text-center">
          <BarChart3 className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Analysis Available</h3>
          <p className="text-text-secondary text-sm">Select a generated component to view detailed analysis</p>
        </div>
      </div>
    );
  }

  const generator = new AdvancedCodeGenerator({ document: {} as any, name: '', version: '', lastModified: '' }, {} as any);
  const qualityMetrics = generator.calculateQualityMetrics(selectedComponent);
  const aiSuggestions = generator.generateAISuggestions(selectedComponent);

  return (
    <div className="w-80 bg-editor-panel border-l border-editor-border overflow-y-auto flex-shrink-0">
      <div className="p-6 space-y-6">
        
        {/* Quality Metrics */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center text-text-primary">
            <BarChart3 className="w-4 h-4 mr-2 text-brand-secondary" />
            Code Quality Metrics
          </h3>
          
          <Card className="bg-gradient-to-br from-brand-success/20 to-brand-primary/20 border-brand-success/30">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-brand-success mb-1">
                {qualityMetrics.overall}/100
              </div>
              <div className="text-xs text-text-secondary">Overall Quality Score</div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-primary">Code Accuracy</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-editor-hover rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-success rounded-full transition-all duration-500" 
                    style={{ width: `${qualityMetrics.accuracy}%` }}
                  />
                </div>
                <span className="text-brand-success font-medium text-xs w-8">
                  {qualityMetrics.accuracy}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-primary">Performance</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-editor-hover rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-success rounded-full transition-all duration-500" 
                    style={{ width: `${qualityMetrics.performance}%` }}
                  />
                </div>
                <span className="text-brand-success font-medium text-xs w-8">
                  {qualityMetrics.performance}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-primary">Accessibility</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-editor-hover rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-success rounded-full transition-all duration-500" 
                    style={{ width: `${qualityMetrics.accessibility}%` }}
                  />
                </div>
                <span className="text-brand-success font-medium text-xs w-8">
                  {qualityMetrics.accessibility}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-primary">Responsiveness</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-editor-hover rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-success rounded-full transition-all duration-500" 
                    style={{ width: `${qualityMetrics.responsiveness}%` }}
                  />
                </div>
                <span className="text-brand-success font-medium text-xs w-8">
                  {qualityMetrics.responsiveness}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-editor-border" />

        {/* Accessibility Report */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center text-text-primary">
            <Shield className="w-4 h-4 mr-2 text-brand-secondary" />
            Accessibility Report
          </h3>
          
          <Card className={`border ${
            selectedComponent.accessibility.wcagCompliance === 'AAA' ? 'border-green-500/20 bg-green-500/5' :
            selectedComponent.accessibility.wcagCompliance === 'AA' ? 'border-green-500/20 bg-green-500/5' :
            selectedComponent.accessibility.wcagCompliance === 'A' ? 'border-yellow-500/20 bg-yellow-500/5' :
            'border-red-500/20 bg-red-500/5'
          }`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className={`w-4 h-4 ${
                    selectedComponent.accessibility.wcagCompliance === 'AAA' || selectedComponent.accessibility.wcagCompliance === 'AA' 
                      ? 'text-green-400' 
                      : selectedComponent.accessibility.wcagCompliance === 'A' 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                  }`} />
                  <span className="text-sm font-medium text-text-primary">
                    WCAG {selectedComponent.accessibility.wcagCompliance} Compliance
                  </span>
                </div>
                <Badge variant={selectedComponent.accessibility.wcagCompliance === 'Non-compliant' ? 'destructive' : 'secondary'}>
                  {selectedComponent.accessibility.wcagCompliance === 'Non-compliant' ? 'FAIL' : 'PASS'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {selectedComponent.accessibility.issues.slice(0, 3).map((issue, index) => (
              <div key={index} className="flex items-start text-sm">
                {issue.type === 'error' ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                ) : issue.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className="text-text-primary font-medium">{issue.message}</div>
                  <div className="text-text-secondary text-xs">{issue.fix}</div>
                </div>
              </div>
            ))}
            
            {selectedComponent.accessibility.suggestions.slice(0, 2).map((suggestion, index) => (
              <div key={index} className="flex items-start text-sm">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-text-secondary">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-editor-border" />

        {/* Performance Analysis */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center text-text-primary">
            <Zap className="w-4 h-4 mr-2 text-brand-secondary" />
            Performance Analysis
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            <Card className="bg-editor-hover border-editor-border">
              <CardContent className="p-2 text-center">
                <div className="font-mono text-brand-success text-sm">
                  {selectedComponent.metadata.performance.bundleSize}
                </div>
                <div className="text-text-muted text-xs">Bundle Size</div>
              </CardContent>
            </Card>
            
            <Card className="bg-editor-hover border-editor-border">
              <CardContent className="p-2 text-center">
                <div className="font-mono text-brand-success text-sm">
                  {selectedComponent.metadata.performance.linesOfCode}
                </div>
                <div className="text-text-muted text-xs">Lines of Code</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-primary">Render Performance</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  selectedComponent.metadata.performance.renderPerformance === 'excellent' 
                    ? 'text-green-400 bg-green-400/10' 
                    : selectedComponent.metadata.performance.renderPerformance === 'good'
                      ? 'text-blue-400 bg-blue-400/10'
                      : 'text-yellow-400 bg-yellow-400/10'
                }`}
              >
                {selectedComponent.metadata.performance.renderPerformance}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-primary">Memory Usage</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  selectedComponent.metadata.performance.memoryUsage === 'low' 
                    ? 'text-green-400 bg-green-400/10' 
                    : selectedComponent.metadata.performance.memoryUsage === 'moderate'
                      ? 'text-yellow-400 bg-yellow-400/10'
                      : 'text-red-400 bg-red-400/10'
                }`}
              >
                {selectedComponent.metadata.performance.memoryUsage}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-primary">Bundle Impact</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  selectedComponent.metadata.performance.bundleImpact === 'low' 
                    ? 'text-green-400 bg-green-400/10' 
                    : selectedComponent.metadata.performance.bundleImpact === 'moderate'
                      ? 'text-yellow-400 bg-yellow-400/10'
                      : 'text-red-400 bg-red-400/10'
                }`}
              >
                {selectedComponent.metadata.performance.bundleImpact}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-editor-border" />

        {/* Dependencies */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center text-text-primary">
            <Package className="w-4 h-4 mr-2 text-brand-secondary" />
            Dependencies
          </h3>
          
          <div className="space-y-1">
            {selectedComponent.metadata.dependencies.map((dep, index) => (
              <div key={index} className="flex items-center justify-between text-sm p-2 bg-editor-hover rounded border border-editor-border">
                <span className="text-text-primary">{dep}</span>
                <Badge variant="outline" className="text-xs text-text-muted">
                  latest
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-editor-border" />

        {/* AI Suggestions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center text-text-primary">
            <Lightbulb className="w-4 h-4 mr-2 text-brand-secondary" />
            AI Suggestions
          </h3>
          
          <div className="space-y-2">
            {aiSuggestions.map((suggestion, index) => (
              <Card key={index} className="border-editor-border">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      suggestion.type === 'performance' ? 'bg-yellow-400/10' :
                      suggestion.type === 'accessibility' ? 'bg-blue-400/10' :
                      suggestion.type === 'design' ? 'bg-purple-400/10' :
                      'bg-green-400/10'
                    }`}>
                      <i className={`${suggestion.icon} ${suggestion.color} text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-text-primary mb-1">
                        {suggestion.title}
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed">
                        {suggestion.description}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`mt-2 text-xs ${
                          suggestion.priority === 'high' ? 'border-red-400 text-red-400' :
                          suggestion.priority === 'medium' ? 'border-yellow-400 text-yellow-400' :
                          'border-green-400 text-green-400'
                        }`}
                      >
                        {suggestion.priority} priority
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="bg-editor-border" />

        {/* Export Options */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm flex items-center text-text-primary">
            <Download className="w-4 h-4 mr-2 text-brand-secondary" />
            Export Options
          </h3>
          
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="ghost" 
              className="justify-between text-sm p-2 bg-editor-hover hover:bg-editor-border"
              onClick={() => onExport('zip')}
            >
              <span>ZIP Archive</span>
              <FileArchive className="w-4 h-4 text-text-muted" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-between text-sm p-2 bg-editor-hover hover:bg-editor-border"
              onClick={() => onExport('codesandbox')}
            >
              <span>CodeSandbox</span>
              <ExternalLink className="w-4 h-4 text-text-muted" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-between text-sm p-2 bg-editor-hover hover:bg-editor-border"
              onClick={() => onExport('github')}
            >
              <span>GitHub Gist</span>
              <Github className="w-4 h-4 text-text-muted" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="justify-between text-sm p-2 bg-editor-hover hover:bg-editor-border"
              onClick={() => onExport('storybook')}
            >
              <span>Storybook</span>
              <Eye className="w-4 h-4 text-text-muted" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
