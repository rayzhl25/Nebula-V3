
import React, { useState, useEffect } from 'react';
import { 
  Save, Globe, Shield, Code, FileUp, Database, Server, Tag, Info, 
  Play, Plus, Trash2, Key, Box, Settings, X
} from 'lucide-react';

interface SystemConfigEditorProps {
  file: any;
}

// Mock Java Classes for selection
const MOCK_JAVA_CLASSES = [
    { 
        name: 'com.nebula.sys.AuthInterceptor', 
        methods: [
            { name: 'preHandle', params: ['request', 'response', 'handler'] },
            { name: 'postHandle', params: ['request', 'response', 'modelAndView'] }
        ]
    },
    { 
        name: 'com.nebula.sys.DataEnricher', 
        methods: [
            { name: 'enrichUserData', params: ['userId', 'context'] },
            { name: 'maskSensitiveInfo', params: ['dataObject'] }
        ]
    },
    { 
        name: 'com.nebula.ext.LogService', 
        methods: [
            { name: 'logRequest', params: ['url', 'payload'] },
            { name: 'logError', params: ['exception', 'context'] }
        ]
    }
];

interface JavaHookConfig {
    enabled: boolean;
    className: string;
    methodName: string;
    args: Record<string, string>; // paramName -> value/expression
}

interface EnvParam {
    id: string;
    key: string;
    testValue: string;
    prodValue: string;
    description: string;
}

const SystemConfigEditor: React.FC<SystemConfigEditorProps> = ({ file }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'env' | 'auth' | 'hooks'>('basic');
  const [tags, setTags] = useState<string[]>(['ERP', 'Legacy']);
  const [newTag, setNewTag] = useState('');
  
  // Form State
  const [config, setConfig] = useState({
      name: file?.title || 'New System',
      description: 'Main enterprise resource planning system connection.',
      testUrl: 'https://test-api.example.com',
      prodUrl: 'https://api.example.com',
      authType: 'bearer',
      authKey: '',
      authSecret: '',
      // New Hook Structure
      preAction: { enabled: false, className: '', methodName: '', args: {} } as JavaHookConfig,
      postAction: { enabled: false, className: '', methodName: '', args: {} } as JavaHookConfig
  });

  const [envParams, setEnvParams] = useState<EnvParam[]>([
      { id: '1', key: 'API_TIMEOUT', testValue: '5000', prodValue: '3000', description: 'Request timeout in ms' },
      { id: '2', key: 'MAX_RETRIES', testValue: '3', prodValue: '1', description: 'Retry count' }
  ]);

  // Ensure config updates if file changes
  useEffect(() => {
      if (file?.title && config.name === 'New System') {
          setConfig(prev => ({...prev, name: file.title}));
      }
  }, [file]);

  const handleAddTag = () => {
      if(newTag.trim()) {
          setTags([...tags, newTag.trim()]);
          setNewTag('');
      }
  };

  const removeTag = (tag: string) => {
      setTags(tags.filter(t => t !== tag));
  };

  const updateHook = (type: 'preAction' | 'postAction', updates: Partial<JavaHookConfig>) => {
      setConfig(prev => ({
          ...prev,
          [type]: { ...prev[type], ...updates }
      }));
  };

  const addEnvParam = () => {
      setEnvParams([...envParams, { id: Date.now().toString(), key: '', testValue: '', prodValue: '', description: '' }]);
  };

  const updateEnvParam = (id: string, field: keyof EnvParam, value: string) => {
      setEnvParams(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deleteEnvParam = (id: string) => {
      setEnvParams(prev => prev.filter(p => p.id !== id));
  };

  const renderHookSelector = (label: string, type: 'preAction' | 'postAction') => {
      const hookData = config[type];
      const selectedClass = MOCK_JAVA_CLASSES.find(c => c.name === hookData.className);
      const selectedMethod = selectedClass?.methods.find(m => m.name === hookData.methodName);

      return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <Settings size={16} className="text-nebula-500" />
                      {label}
                  </h3>
                  <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Enable Hook</label>
                      <input 
                        type="checkbox" 
                        checked={hookData.enabled}
                        onChange={(e) => updateHook(type, { enabled: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-nebula-600 focus:ring-nebula-500"
                      />
                  </div>
              </div>

              {hookData.enabled && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Java Class</label>
                              <select 
                                value={hookData.className}
                                onChange={(e) => updateHook(type, { className: e.target.value, methodName: '', args: {} })}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:border-nebula-500"
                              >
                                  <option value="">Select Class...</option>
                                  {MOCK_JAVA_CLASSES.map(cls => (
                                      <option key={cls.name} value={cls.name}>{cls.name}</option>
                                  ))}
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Method</label>
                              <select 
                                value={hookData.methodName}
                                onChange={(e) => updateHook(type, { methodName: e.target.value, args: {} })}
                                disabled={!hookData.className}
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:border-nebula-500 disabled:opacity-50"
                              >
                                  <option value="">Select Method...</option>
                                  {selectedClass?.methods.map(m => (
                                      <option key={m.name} value={m.name}>{m.name}</option>
                                  ))}
                              </select>
                          </div>
                      </div>

                      {selectedMethod && (
                          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                              <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-3">Method Arguments Configuration</h4>
                              <div className="space-y-2">
                                  {selectedMethod.params.map(param => (
                                      <div key={param} className="flex items-center gap-3">
                                          <div className="w-32 flex-shrink-0 text-xs font-mono text-blue-600 dark:text-blue-400">{param}</div>
                                          <span className="text-gray-400">=</span>
                                          <input 
                                            type="text" 
                                            value={hookData.args[param] || ''}
                                            onChange={(e) => updateHook(type, { args: { ...hookData.args, [param]: e.target.value } })}
                                            placeholder="Value or expression..."
                                            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:border-nebula-500"
                                          />
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-sm">
      {/* Toolbar */}
      <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
         <div className="flex items-center gap-2">
            <Server size={18} className="text-purple-500" />
            <span className="font-bold text-gray-700 dark:text-gray-200">{config.name}</span>
            <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs px-2 py-0.5 rounded">External System</span>
         </div>
         <button className="flex items-center gap-1 px-3 py-1.5 bg-nebula-600 text-white rounded hover:bg-nebula-700 text-xs font-medium transition-colors">
            <Save size={14} /> Save Config
         </button>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex gap-6">
          {[
              { id: 'basic', label: 'Basic Info', icon: Info },
              { id: 'env', label: 'Environments', icon: Globe },
              { id: 'auth', label: 'Authentication', icon: Shield },
              { id: 'hooks', label: 'Hooks (Java)', icon: Box },
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                    activeTab === tab.id 
                    ? 'border-nebula-600 text-nebula-600 dark:text-nebula-400 font-medium' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                  <tab.icon size={16} />
                  {tab.label}
              </button>
          ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">System Name</label>
                          <input 
                            type="text" 
                            value={config.name} 
                            onChange={e => setConfig({...config, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-nebula-500 outline-none" 
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                              {tags.map(tag => (
                                  <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                                      {tag}
                                      <button onClick={() => removeTag(tag)} className="hover:text-red-500"><Trash2 size={10} /></button>
                                  </span>
                              ))}
                              <div className="flex items-center gap-1">
                                  <input 
                                    type="text" 
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                                    placeholder="Add tag..."
                                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent outline-none w-24 focus:w-32 transition-all"
                                  />
                                  <button onClick={handleAddTag} className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200"><Plus size={12} /></button>
                              </div>
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description / Remarks</label>
                          <textarea 
                            value={config.description}
                            onChange={e => setConfig({...config, description: e.target.value})}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-nebula-500 outline-none resize-none"
                          />
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Import API Definitions</label>
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-nebula-500 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all">
                              <FileUp size={24} className="text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Drag & Drop or Click to Import</span>
                              <span className="text-xs text-gray-400 mt-1">Supports OpenAPI (Swagger) JSON/YAML</span>
                          </div>
                      </div>
                  </div>
              )}

              {/* Environments Tab */}
              {activeTab === 'env' && (
                  <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Base URLs</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Test Environment
                                  </label>
                                  <input 
                                    type="text" 
                                    value={config.testUrl}
                                    onChange={e => setConfig({...config, testUrl: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-nebula-500 outline-none font-mono text-xs"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                      <span className="w-2 h-2 rounded-full bg-blue-500"></span> Production Environment
                                  </label>
                                  <input 
                                    type="text" 
                                    value={config.prodUrl}
                                    onChange={e => setConfig({...config, prodUrl: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-nebula-500 outline-none font-mono text-xs"
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Environment Variables Table */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">Environment Parameters</h3>
                              <button onClick={addEnvParam} className="text-xs flex items-center gap-1 bg-nebula-600 text-white px-2 py-1 rounded hover:bg-nebula-700 transition-colors">
                                  <Plus size={12} /> Add Parameter
                              </button>
                          </div>
                          <table className="w-full text-left text-xs">
                              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase">
                                  <tr>
                                      <th className="p-3">Key</th>
                                      <th className="p-3 text-green-600">Test Value</th>
                                      <th className="p-3 text-blue-600">Prod Value</th>
                                      <th className="p-3">Description</th>
                                      <th className="p-3 w-10"></th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                                  {envParams.map(param => (
                                      <tr key={param.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                          <td className="p-2">
                                              <input type="text" value={param.key} onChange={(e) => updateEnvParam(param.id, 'key', e.target.value)} className="w-full bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded px-2 py-1 outline-none focus:border-nebula-500" placeholder="KEY_NAME" />
                                          </td>
                                          <td className="p-2">
                                              <input type="text" value={param.testValue} onChange={(e) => updateEnvParam(param.id, 'testValue', e.target.value)} className="w-full bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded px-2 py-1 outline-none focus:border-nebula-500" placeholder="Test Value" />
                                          </td>
                                          <td className="p-2">
                                              <input type="text" value={param.prodValue} onChange={(e) => updateEnvParam(param.id, 'prodValue', e.target.value)} className="w-full bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded px-2 py-1 outline-none focus:border-nebula-500" placeholder="Prod Value" />
                                          </td>
                                          <td className="p-2">
                                              <input type="text" value={param.description} onChange={(e) => updateEnvParam(param.id, 'description', e.target.value)} className="w-full bg-transparent border border-transparent hover:border-gray-300 dark:hover:border-gray-600 rounded px-2 py-1 outline-none focus:border-nebula-500" placeholder="Optional desc..." />
                                          </td>
                                          <td className="p-2 text-center">
                                              <button onClick={() => deleteEnvParam(param.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                  <X size={14} />
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                                  {envParams.length === 0 && (
                                      <tr>
                                          <td colSpan={5} className="p-4 text-center text-gray-400 italic">No parameters defined. Click "Add Parameter" to start.</td>
                                      </tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {/* Auth Tab */}
              {activeTab === 'auth' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Authorization Type</label>
                          <select 
                            value={config.authType}
                            onChange={e => setConfig({...config, authType: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-nebula-500 outline-none"
                          >
                              <option value="none">No Auth</option>
                              <option value="bearer">Bearer Token</option>
                              <option value="basic">Basic Auth</option>
                              <option value="apikey">API Key</option>
                              <option value="oauth2">OAuth 2.0</option>
                          </select>
                      </div>

                      {config.authType !== 'none' && (
                          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Token / Username</label>
                                  <div className="relative">
                                      <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                      <input 
                                        type="password" 
                                        value={config.authKey}
                                        onChange={e => setConfig({...config, authKey: e.target.value})}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:border-nebula-500"
                                        placeholder="Enter key..."
                                      />
                                  </div>
                              </div>
                              {['basic', 'oauth2'].includes(config.authType) && (
                                  <div>
                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password / Client Secret</label>
                                      <div className="relative">
                                          <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                          <input 
                                            type="password" 
                                            value={config.authSecret}
                                            onChange={e => setConfig({...config, authSecret: e.target.value})}
                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:border-nebula-500"
                                            placeholder="Enter secret..."
                                          />
                                      </div>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
              )}

              {/* Hooks Tab */}
              {activeTab === 'hooks' && (
                  <div className="space-y-6">
                      {renderHookSelector('Global Pre-request Operation', 'preAction')}
                      {renderHookSelector('Global Post-request Operation', 'postAction')}
                  </div>
              )}

          </div>
      </div>
    </div>
  );
};

export default SystemConfigEditor;
